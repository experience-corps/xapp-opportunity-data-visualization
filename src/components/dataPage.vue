<template>
    <div> 
      <v-app>
         <v-toolbar 
           color = "#311B92"
           max-height = "100px">  
           <v-btn class="ma-2" dark
             color = '#2196F3'
             @click = 'returnToSelections'>
            <v-icon dark left>arrow_back</v-icon>Back
           </v-btn>
           <h1 class = "opportunityTitle"> {{oppName}} </h1>
         </v-toolbar> 
         <div class = "graphs">
           <v-toolbar
             color = "#512DA8"
             max-height = "75px">
               <h3 class = "timelineTitle"> Opportunity Timeline</h3>
           </v-toolbar>  
           <fusioncharts
             :type="type"
             :width="width"
             :height="height"
             :dataFormat="dataFormat"
             :dataSource="dataSource"
            >
           </fusioncharts>
           <!-- <v-card
            height= "300"
            v-if = '!timelineData'> 
             <v-card-text>
              No timeline data available.
             </v-card-text>
           </v-card>   -->
         </div>
      </v-app>
    </div>
</template>

<script>
export default {
    props : ['opp', 'oppName'], 
    data(){
        return{
            "type" : 'gantt',
            "width" : "100%", 
            "height" : "600", 
            "dataFormat" : 'json',
            "dataSource" : {
                "chart": {
                "dateformat": "mm/dd/yyyy", 
                "showTaskLabels": "1", 
                "slackFillColor": "#e44a00",
                "taskBarFillMix": "light+0", 
                "taskBarRoundRadius": "10", 
                "hoverBandColor" : "#327ba8", 
                "hoverBandAlpha": "40"
                }, 
                "categories" : [  
                ], 
                "processes" : {
                    "fontsize": "10",
                    "isbold": "1",
                    "align": "left", 
                    "headertext": 'Stages', 
                    "headeralign": 'left',
                    'headervalign':'bottom',
                    "headerFontSize": "14", 
                    "headerIsUnderline": "1", 
                    "bgColor": "#036ffc", 
                    "fontColor": "#ffffff", 
                    "headerBgColor": "#036ffc", 
                    "headerFontColor": "#ffffff"
                }, 
                "tasks" : {
                    "color": "#036ffc",
                }, 
                "datatable":{
                    "fontsize": "10",
                    "align": "center",
                    "headeralign": "center",
                    'headervalign':'bottom',
                    "headerfontsize": "12",
                    "datacolumn" : '[]', 
                    "headerIsUnderline": "1", 
                    "bgColor": "#036ffc", 
                    "fontColor": "#ffffff", 
                    "headerBgColor": "#036ffc", 
                    "headerFontColor": "#ffffff"
                } 
            }
        }
    }, 
    mounted(){
        var dataObject = this.opp;
        this.dataSource['processes']['process'] = dataObject['processes']
        this.dataSource['tasks']['task'] = dataObject['tasks'];
        this.dataSource['categories'].push({"fontColor": "#ffffff", "bgColor": "#036ffc", 'category' : dataObject['quarterCategory']});
        this.dataSource['categories'].push({"fontColor": "#ffffff", "bgColor": "#036ffc",'category' : dataObject['monthCategory']});
        this.dataSource['datatable']['datacolumn'] = [{"headerFontColor": "#ffffff", "fontColor": "#ffffff", "headerBgColor": "#036ffc", "headertext": "Start Date", 'text' : dataObject['startsColumn'], "isBold": "1"}, 
           {"headertext": "End Date", 'text' : dataObject['endsColumn'], "isBold": "1"}]; 
    }, 
    methods : {
        returnToSelections(){
            this.$router.push({name : "Select"});
        }
    }
}
</script>

<style scoped>
  .opportunityTitle{
      color: white;
  }
  
  .timelineTitle{
      color: white;
  }
  .graphs{
      background-color: #5E35B1;
  }
</style>