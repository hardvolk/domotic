(function(){
    var app = angular.module('domoticApp', ['ionic'])
  
     app.controller('AppCtrl', function($scope, $http, $interval) {
         $scope.Micro = {};
         $scope.Micro.state = 'Conectando...';
         $scope.Micro.tv = true;
         $scope.Micro.weather = 40;
         $scope.Micro.lights = true;
         $scope.Micro.door = false;
         $scope.Micro.coffee = false;
         $scope.Micro.alarmState = '';
         $scope.Platform = "App";
         $scope.userkey = 18082016;
         $scope.SetValues = false;
         
         // This structure is used to check if the user
         //made a change in the values of the devices
         var Changes = {
             value: false, 
             devices: {}
         };
        
        //url-encoded params
        var params;
        
         //Function to get the values from server
        $scope.getValues = function(){
             params = "?Platform=App&userkey=18082016&SetValues="+$scope.SetValues;
             
             //Fetch values
             $http({
                 url: 'http://hardvolk.com/Domotic/index.php'+params,
                 method: "GET",
                 headers: {'Content-Type': 'application/x-www-form-urlencoded'}
             }).success(function (response, status, headers, config) {
                 /*console.log('Enviando Params: -------------------');
                 console.log(params);
                 console.log('Respuesta de getValues:');
                 console.log(response);
                 console.log('----------------------------');
                 */
                 if(Changes.value == true){
                     console.log("Actualizar Valores............")  ;
                     $scope.UpdateValues(response);
                 } 
                 else $scope.ApplyValues(response);

                 
             }).error(function (response, status, headers, config) {
                 console.log('Error al recibir datos del servidor: ' + response);
             });
        };
        
        $scope.UpdateValues = function(data){
            console.log("Hay que actualizar: " );
            console.log(Changes.devices);
            
            //Save just the values of devices not changed for the user
            
            //If the user not changed the TV's value apply this new value coming from server and so on
            if(!("tv" in Changes.devices)) $scope.Micro.tv = (data.tv == 1) ? true:false;
            if(!("weather" in Changes.devices)) $scope.Micro.weather = data.weather;
            if(!("lights" in Changes.devices)) $scope.Micro.lights = (data.lights == 1) ? true:false;
            if(!("door" in Changes.devices)) $scope.Micro.door = (data.door == 1) ? true:false;
            if(!("coffee" in Changes.devices)) $scope.Micro.coffee = (data.coffee == 1) ? true:false;
            
                        
            //POST the current configuration to server
            // Preparing the vars that are going to be send
             $scope.SetValues = true;
             var tv = ($scope.Micro.tv == true) ? 1:0;
             var lights = ($scope.Micro.lights == true) ? 1:0;
             var door = ($scope.Micro.door == true) ? 1:0;
             var coffee = ($scope.Micro.coffee == true) ? 1:0;
            
             params = "?Platform=App&userkey=18082016&SetValues="+$scope.SetValues+"&tv="+tv+"&lights="+lights+"&door="+door+"&coffee="+coffee+"&weather="+$scope.Micro.weather;
            
            //Sending the new values
            $http({
             url: 'http://hardvolk.com/Domotic/index.php'+params,
             method: "GET",
             headers: {'Content-Type': 'application/x-www-form-urlencoded'}
         }).success(function (response, status, headers, config) {
                /*console.log('Respuesta del Servidor al enviar nuevos datos:');
                console.log(response);
                */
         }).error(function (response, status, headers, config) {
             console.log('Error al enviar datos: ' + response);
         });
            //Reset Changes vars
            Changes.devices = {};
            Changes.value = false;
            $scope.SetValues = false;
            
            
            
        };
                    
        $scope.ApplyValues = function(data){
             //Apply Values
             $scope.Micro.state = data.state;
             $scope.Micro.tv = (data.tv == 1) ? true:false;
             $scope.Micro.weather = data.weather;
             $scope.Micro.lights = (data.lights == 1) ? true:false;
             $scope.Micro.door = (data.door == 1) ? true:false;
             $scope.Micro.coffee = (data.coffee == 1) ? true:false;
            
            //Update alarm state
            if(data.alarm == 1 && data.state == 'Conectado'){
                $scope.playAlarm();
            }else $scope.stopAlarm();
            
         };
    
        // Change handler
        $scope.ChangeHandler = function(name){
            console.log('User changed: -------------------------------- ' + name);
            Changes.value = true;
            Changes.devices[name] = true;
            //$scope[name] = !$scope[name];
            console.log("Micro Values:");
            console.log($scope.Micro);
        };
         
        //Get initial values
        $scope.getValues();
         
        // Function for updating the values
        $interval($scope.getValues, 3000);
         
        // Audio Alarm
        $scope.playAlarm = function(){
            var audio = document.getElementById('audio');
            
            if(audio.paused){
              audio.play();
              $scope.Micro.alarmState = 'alarm-on';
            }
         }
        
        $scope.stopAlarm = function(){
            document.getElementById('audio').pause();
            $scope.Micro.alarmState = '';
        }

      ionic.Platform.ready(function() {
        navigator.splashscreen.hide();
      });

     });
    
}());
              
              