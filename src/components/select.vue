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