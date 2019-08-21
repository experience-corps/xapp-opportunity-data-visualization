<template>
  <div> 
    <v-app> 
         <v-toolbar 
           color = "#311B92"
           max-height = "100px"
           >  
          <h1 id = "oppTitle"> Opportunity Data</h1>
         </v-toolbar> 
         <div class = "selections">
             <v-card class="dropDown"
               color = "#512DA8"> 
               <v-card-title> 
                   <h4 class = "selectOppTitle"> Select an opportunity from the menu </h4>
               </v-card-title> 
               <div class ="selectContainer">
                  <v-flex xs12 sm6 d-flex>
                    <v-select
                     label="Opportunities"
                     solo
                     :items="oppOptionsArray"
                     @change = 'getOppData($event)'>
                     </v-select>
                  </v-flex>
                </div>
             </v-card> 
             <v-card class="searchBox"
               color = "#5E35B1"> 
               <v-card-title> 
                 <h4 class = "searchOppTitle"> Search for an opportunity </h4>
               </v-card-title> 
               <div class="searchContainer">
                 <v-autocomplete
                   label="Opportunities"
                   placeholder="Start typing to search"
                   prepend-icon="mdi-database-search"
                   :items="oppOptionsArray"
                   dark
                   @change = 'getOppData($event)'>
                 </v-autocomplete> 
               </div>
             </v-card> 
         </div>
      </v-app> 
  </div>
</template>

<script>
import oppsTimelineData from './oppsTimelineData'
import oppOptions from './oppsOptions'
export default {
    data(){
        return{
          oppOptionsArray : oppOptions, 
          oppsTimelineData: null
        }
    },
    methods :{
        getOppData(event){
          this.oppsTimelineData = oppsTimelineData[event];
          this.makeOppTimeline()
        }, 
        makeOppTimeline(){
          var organizedStages = this.organizeStages(this.oppsTimelineData); 
          console.log('org', organizedStages)
          var processesArray = this.createProcesses(organizedStages);
          console.log('pro', processesArray)
          var tasksArray =  this.createTasks(organizedStages);
          console.log('task', tasksArray)
          var starts = this.createStartAndEnd(tasksArray)[0];
          var ends = this.createStartAndEnd(tasksArray)[1];
          console.log('se', starts, ends);
        }, 
        organizeStages(stages){
            var organized =[];
            var closed = null; 
            var invoiced = null; 
            var lost = null;
            var stagesArray = Object.entries(stages);
            for(var i = 0; i < stagesArray.length; i++){
                if(stagesArray[i][0] === 'Lost'){
                    lost = stagesArray[i];
                }
                else if(stagesArray[i][0] === 'Closed - Won (to be invoiced)'){
                    closed = stagesArray[i];
                } 
                else if(stagesArray[i][0] === 'Invoiced'){
                    invoiced = stagesArray[i];
                }
            }
            console.log('1', stagesArray);
            var numStages = stagesArray.filter(function(x){return x[0] !== 'Lost' && x[0] !== 'Closed - Won (to be invoiced)' && x[0] !==  'Invoiced' && x[0] !== 'Canceled' && x[0] !== 'In Progress' && x[0] !== 'Planned'});
            console.log('2', numStages);
            numStages.sort(function(a, b){return new Date(Number(a[1].split('/')[2]), Number(a[1].split('/')[0]), Number(a[1].split('/')[1])) -  new Date(Number(b[1].split('/')[2]), Number(b[1].split('/')[0]), Number(b[1].split('/')[1]))});
            console.log('3', numStages);
            if(lost){
                numStages.push(lost);
            } 
            if(closed){
                numStages.push(closed);
            }
            if(invoiced){
                numStages.push(invoiced);
            }
            return numStages;
        }, 
        createProcesses(organizedStages){
            var processesArray = [];
            for(var i = 0; i < organizedStages.length; i++){
                var stageName = organizedStages[i][0];
                processesArray.push({'label' : stageName});
            }
            return processesArray;
        }, 
        createTasks(organizedStages){
            var tasksArray = [];
            for(var i = 0; i < organizedStages.length; i++){
                if(i === organizedStages.length-1){
                    var dateToday = new Date(); 
                    var dateTodayString = '' + (dateToday.getMonth()+1) +  '/' + dateToday.getDate() +  '/' + dateToday.getFullYear();
                    var task = {'start' : organizedStages[i][1], 'end': dateTodayString};
                } else{
                    var task = {'start' : organizedStages[i][1], 'end' : organizedStages[i+1][1]}
                }
                tasksArray.push(task);
            }
            return tasksArray;
        }, 
        createStartAndEnd(tasksArray){
            var dataColumnStartText = []; 
            var dataColumnEndText = [];
            for(var i = 0; i < tasksArray.length; i++){
                dataColumnStartText.push({'label' : tasksArray[i]['start']});
                dataColumnEndText.push({'label' : tasksArray[i]['end']});
            }
            return [dataColumnStartText, dataColumnEndText]
        }, 
        createQuarters(tasksArray){
            var firstDate = tasksArray[0]['start'];
            var lastDate = tasksArray[tasksArray.length-1]['end'];
            var firstDateMonth = Number(firstDate.split('/')[0]); 
            var lastDateMonth = Number(lastDate.split('/')[0]); 
            var firstYear = firstDate.split('/')[2];
            var lastYear = lastDate.split('/')[2];
            var yearDiff = Number(lastYear) - Number(firstYear);
            if(yearDiff === 0){
                quarterDates = [{'quarter' : `Q1 ${firstYear}` , 'date' : `1/1/${firstYear}`}, {'quarter' : `Q1 ${firstYear}`, 'date' : `3/31/${firstYear}`}, 
                {'quarter' : `Q2 ${firstYear}` , 'date' : `4/1/${firstYear}`}, {'quarter' : `Q2 ${firstYear}` , 'date' : `6/30/${firstYear}`}, {'quarter' : `Q3 ${firstYear}`, 'date' : `7/1/${firstYear}`}, 
                {'quarter' : `Q3 ${firstYear}`, 'date' : `9/30/${firstYear}`}, {'quarter' : `Q4 ${firstYear}` , 'date' : `10/1/${firstYear}`}, {'quarter' : `Q4 ${firstYear}`, 'date' : `12/31/${firstYear}`}]
            }

        }
    }
}
</script>


<style scoped>
  #oppTitle{
    color: white;
  }
  .selections{
    display: flex; 
    flex-direction: row; 
  }
  .dropDown{
    width: 50%; 
    height: 700px;
    border-right: 1px solid white;
  }
  .searchBox{
    width: 50%; 
    height: 700px;
  }
  .selectOppTitle, .searchOppTitle{
    color: white;
  }
  .selectContainer{
    position: relative; 
    left: 20px; 
    top: 50px;
  }
  .searchContainer{
    width: 80%;
    position: relative; 
    top: 50px; 
    left: 20px; 
  }
</style>