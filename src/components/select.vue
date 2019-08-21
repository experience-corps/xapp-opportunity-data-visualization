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
                    ></v-select>
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
                   dark>
                 </v-autocomplete> 
               </div>
             </v-card> 
         </div>
      </v-app> 
  </div>
</template>


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