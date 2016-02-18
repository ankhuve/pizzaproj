 dataArray = [];

 $.ajax({
     url: 'http://www.omdbapi.com/?s=Batman&type=movie&page=1',
     type: 'GET',
     dataType: 'json',
     success: function (data, textStatus, xhr) {
         console.log(data);
         loopLength = Math.ceil(data.totalResults / 10);
         console.log(loopLength)

         lopiloop();
     }
 })
 var url = "http://www.omdbapi.com/?s=Batman&type=movie&page="

 function lopiloop() {

     for (var i = 1; i <= loopLength; i++) {

         $.ajax({
             url: url + i.toString(),
             type: 'GET',
             dataType: 'json',
             success: function (data, textStatus, xhr) {
                 dataArray.push(data.Search);

             }
         })

     }
     setTimeout(function () {
         fix()
     }, 500);

 }

 function fix() {

     var fixedList = [];

     for (var j = 0; j < dataArray.length; j++) {
         for (var l = 0; l <= 9; l++) {
             if (dataArray[j][l] != null) {
                 fixedList.push(dataArray[j][l]);
             }
         }
     }

     console.log(fixedList);
 }