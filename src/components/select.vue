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
          oppsTimelineData: null, 
          oppsData : {}
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
          var quarterCategory = this.createQuarters(tasksArray);
          console.log('qc', quarterCategory)
          var startsAndEnds =  this.makeStartAndEndMonths(quarterCategory);
          console.log('sande', startsAndEnds)
          var monthsCategory = this.makeMonths(startsAndEnds);
          console.log('m', monthsCategory);
          this.oppsData['processes'] = processesArray; 
          this.oppsData['tasks'] = tasksArray; 
          this.oppsData['startsColumn'] = starts; 
          this.oppsData['endsColumn'] = ends; 
          this.oppsData['quarterCategory'] = quarterCategory; 
          this.oppsData['monthCategory'] = monthsCategory; 
          
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
            } else{
                var quarterDates = [];
                for(var i = 0; i <= yearDiff; i++){
                    var yearNow = Number(firstYear) + i;
                    var yearNowString = yearNow.toString();
                    quarterDates.push({'quarter' : `Q1 ${yearNowString}`, 'date' : `1/1/${yearNowString}`}, {'quarter' : `Q1 ${yearNowString}` , 'date' : `3/31/${yearNowString}`}, 
                    {'quarter' : `Q2 ${yearNowString}`, 'date' : `4/1/${yearNowString}`}, {'quarter' : `Q2 ${yearNowString}`, 'date' : `6/30/${yearNowString}`}, {'quarter' : `Q3 ${yearNowString}`, 'date' : `7/1/${yearNowString}`}, 
                    {'quarter' : `Q3 ${yearNowString}`, 'date' : `9/30/${yearNowString}`}, {'quarter' : `Q4 ${yearNowString}`, 'date' : `10/1/${yearNowString}`}, {'quarter' : `Q4 ${yearNowString}`, 'date' : `12/31/${yearNowString}`})
                }
            }
            if (firstDateMonth >= 1 && firstDateMonth < 4){
              quarterDates.push({'quarter' : `Q1 ${firstYear}`, 'date' : `${firstDate}`})
            }
            else if (firstDateMonth >= 4 && firstDateMonth < 7){
                quarterDates.push({'quarter' : `Q2 ${firstYear}`, 'date' : `${firstDate}`})
            }
            else if (firstDateMonth >= 7 && firstDateMonth < 10){
                quarterDates.push({'quarter' : `Q3 ${firstYear}`, 'date' : `${firstDate}`})
            }
            else if (firstDateMonth >= 10){
                quarterDates.push({'quarter' : `Q4 ${firstYear}`, 'date' : `${firstDate}`})
            }
            if (lastDateMonth >= 1 && lastDateMonth < 4){
                quarterDates.push({'quarter' : `Q1 ${lastYear}`, 'date' : `${lastDate}`})
            }
            else if (lastDateMonth >= 4 && lastDateMonth < 7){
                quarterDates.push({'quarter' : `Q2 ${lastYear}`, 'date' : `${lastDate}`})
            }
            else if (lastDateMonth >= 7 && lastDateMonth < 10){
                quarterDates.push({'quarter' : `Q3 ${lastYear}`, 'date' : `${lastDate}`})
            }
            else if (lastDateMonth >= 10){
                quarterDates.push({'quarter' : `Q4 ${lastYear}`, 'date' : `${lastDate}`})
            }
            quarterDates.sort(function(a,b){return new Date(Number(a['date'].split('/')[2]), Number(a['date'].split('/')[0]), Number(a['date'].split('/')[1])) - 
            new Date(Number(b['date'].split('/')[2]), Number(b['date'].split('/')[0]), Number(b['date'].split('/')[1]))});
            console.log('q', quarterDates)
            var indexOfFirstDate = quarterDates.map(function(x){return x.date}).indexOf(firstDate);
            var indexOfLastDate = quarterDates.map(function(x){return x.date}).indexOf(lastDate);
            var neededQuarterDates = quarterDates.slice(indexOfFirstDate, indexOfLastDate+1);
            var quarterCategory = [];
            console.log('needed', neededQuarterDates)
            for(var i = 0; i < neededQuarterDates.length; i+=2){
                quarterCategory.push({'start': neededQuarterDates[i]['date'], 'end': neededQuarterDates[i+1]['date'], 'label': neededQuarterDates[i]['quarter']});
            }
            quarterCategory[0]['start'] = `${quarterCategory[0]['start'].split('/')[0]}` + '/' + '1' + '/' + `${quarterCategory[0]['start'].split('/')[2]}`
            var daysInMonthsAndAbrevs = { 1 : [31, 'Jan'], 2 : [28, 'Feb'], 3 : [31, 'Mar'], 4 : [30, 'Apr'], 5 : [31, 'May'], 6 : [30, 'June'], 7 : [31, 'July'], 8 : [31, 'Aug'], 9 : [30, 'Sep'], 10 : [31, 'Oct'], 11 : [30, 'Nov'], 12 : [31, 'Dec']}
            quarterCategory[quarterCategory.length-1]['end'] = `${(quarterCategory[quarterCategory.length-1]['end'].split('/')[0])}` + '/' + `${daysInMonthsAndAbrevs[Number(quarterCategory[quarterCategory.length-1]['end'].split('/')[0])][0]}` + '/' + `${(quarterCategory[quarterCategory.length-1]['end'].split('/')[2])}`;
            return quarterCategory;
        },
        makeStartAndEndMonths(quarterCategory){
            var startsAndEnds = {}; 
            var firstYear = quarterCategory[0]['start'].split('/')[2];
            var firstMonth = quarterCategory[0]['start'].split('/')[0];
            startsAndEnds[firstYear] = [firstMonth]; 
            for(var i = 0; i < quarterCategory.length; i++){
                if(i !== quarterCategory.length-1){
                    var nextYear = quarterCategory[i+1]['start'].split('/')[2];
                }
                if(i === 0 ){
                    if(!startsAndEnds[nextYear]){
                    var currentYear =  quarterCategory[i]['start'].split('/')[2];
                    var lastMonthOfYear = quarterCategory[i]['end'].split('/')[0];
                    var monthsArray = startsAndEnds[currentYear];
                    monthsArray.push(lastMonthOfYear)
                    startsAndEnds[currentYear] = monthsArray;
                    var newYear = quarterCategory[i+1]['start'].split('/')[2];
                    var newMonth =  quarterCategory[i+1]['start'].split('/')[0];
                    startsAndEnds[newYear] = [newMonth];
                    }
                }
                else if (i === quarterCategory.length-1){
                    var currentYear = quarterCategory[i]['start'].split('/')[2];
                    var lastMonthOfCurrentYear = quarterCategory[i]['end'].split('/')[0];
                    var monthsArray = startsAndEnds[currentYear];
                    monthsArray.push(lastMonthOfCurrentYear);
                    startsAndEnds[currentYear] = monthsArray;
                }
                else if(!startsAndEnds[nextYear]){
                    var currentYear = quarterCategory[i]['start'].split('/')[2];
                    var lastMonthOfCurrentYear = quarterCategory[i]['end'].split('/')[0];
                    var monthsArray = startsAndEnds[currentYear];
                    monthsArray.push(lastMonthOfCurrentYear);
                    startsAndEnds[currentYear] = monthsArray;
                    var newYear = quarterCategory[i+1]['start'].split('/')[2];
                    var newMonth = quarterCategory[i+1]['start'].split('/')[0];
                    startsAndEnds[newYear] = [newMonth];   
                }  
            }   
            return startsAndEnds;
        }, 
        makeMonths(startsAndEnds){
            var monthCategory = []; 
            var years = Object.keys(startsAndEnds); 
            years.sort(function(a,b){return Number(a)-Number(b)});
            var daysInMonthsAndAbrevs = { 1 : [31, 'Jan'], 2 : [28, 'Feb'], 3 : [31, 'Mar'], 4 : [30, 'Apr'], 5 : [31, 'May'], 6 : [30, 'June'], 7 : [31, 'July'], 8 : [31, 'Aug'], 9 : [30, 'Sep'], 10 : [31, 'Oct'], 11 : [30, 'Nov'], 12 : [31, 'Dec']};
            var months = []; 
            for(var i = 0; i < years.length; i++){
                for(var j = Number(startsAndEnds[years[i]][0]); j < Number(startsAndEnds[years[i]][1]); j++){
                    var yearsAbrev = years[i].slice(-2); 
                    var numOfDays = daysInMonthsAndAbrevs[j][0];
                    var monthText = daysInMonthsAndAbrevs[j][1];
                    monthCategory.push({'start' : `${j}` + '/' + '1' + '/' + `${yearsAbrev}`, 'end' : `${j}` + '/' + numOfDays + '/' + `${yearsAbrev}`, 'label' :   `${monthText} ${yearsAbrev}`});
                }
            }
            return monthCategory;
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