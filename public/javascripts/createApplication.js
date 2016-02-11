var app = angular.module('project', []);
app.controller('JobAppController', ['$scope', '$http', '$window', function ($scope, $http, $window) {

  /*
  JSON Object that describes what appears in the Create Application form
  Easier to maintain a JSON object and let Angular handle the html logic meaning any changes that need to be made can simply be made by changing this JSON object
  */
  $scope.fields = {
    'Club name': {
      'type': 'text',
      'rows': 1,
      'model': 'club_name'
    },
    'Club description': {
      'type': 'text',
      'rows': 10,
      'model': 'club_desc'
    },
    'roles': {
    },
    'Create Application': {
      'type': 'button',
      'clicked': $scope.create
    }
  };



  $scope.roles = {
    selected: '',
    all : []
  };

  //Data that is going to be saved into the mongodb database
  $scope.field_models = {
    'club_name': "",
    'club_desc': "",
    'username': "",
    'roles': {},
    'files': []
  };

  $scope.upload_status = [];

  var temp_roles = {};
  $scope.add_new_role = function(role_title) {
    if (role_title && role_title!=='') {
      $scope.roles.all.push(role_title);
      $scope.new_role = '';
      $scope.roles.selected = role_title;
      $scope.role_option_select=false;
      console.log($scope.roles.selected);
      var new_questions = question_model_modifier(role_title);
      for (var prop in new_questions) {
        $scope.fields[prop] = new_questions[prop];
      }
      temp_roles[role_title] = new_questions;
      $( "#preview_selected_role").val(role_title);
    }
  };

  /*  Role change event handler (and function)
      The reason for not using angular ng-change was a bug that could not be solved on time.
   */
  $( "#selected_role" ).change(function() {
    var role_title = $( "#selected_role").val();
    $( "#preview_selected_role").val(role_title);
    for (var prop in temp_roles[role_title]) {
      $scope.fields[prop] = temp_roles[role_title][prop];
    }
    console.log($scope.fields);
    // This line of code saves the day (Angular won't update its scope for 5 seconds otherwise).
    $scope.$apply();
  });


  function question_model_modifier (role_title) {
    return {
      'Role description': {
        'type': 'text',
        'rows': 5,
        'model': role_title + '_role_desc'
      },
      'General questions': {
        'type': 'questions',
        'model': role_title + '_general_ques',
        'questions': [
          {
            'question_type': 'Work experience',
            'sample': 'Please outline some previous work experience related to the role.',
            'selected': false
          },
          {
            'question_type': 'Additional work experience',
            'sample': 'Please outline some additional work experience related to the role.',
            'selected': false
          },
          {
            'question_type': 'Problem solving',
            'sample': 'Please give an example of a time where you have identified a problem and devised a solution.',
            'selected': false
          },
          {
            'question_type': 'Leadership',
            'sample': 'Please give an example of a time you took initiative over a bad situation?',
            'selected': false
          },
          {
            'question_type': 'Entrepreneurship',
            'sample': 'Please give an example of a time where you had an idea and made it into a reality.',
            'selected': false
          }
        ]
      },
      'Additional questions': {
        'type': 'questions',
        'model': role_title + '_addition_ques',
        'number': 1,
        'num_ques': num_of_ques,
        'changed': question_added,
        'blurred': question_blank
      },
      'Required Files': {
        'type': 'questions',
        'model': role_title + '_required_files',
        'number': 1,
        'num_ques': num_of_ques,
        'changed': question_added,
        'blurred': question_blank
      }
    };
  }

  /*
    username validation
    This prevents the user from entering characters like space or #!@
   */
  $('#username_input').keypress(function (e) {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      return true;
    }

    e.preventDefault();
    return false;
  });

  //Function that takes in the ng-model of the General Question button that was clicked and toggles between selected and unselected
  $scope.general_ques_clicked = function(field) {
    field.selected = !field.selected;
  };

  /*
  Used to iterate through a fixed integer range (Angular needs an iterable object for ng-repeat)
  idx: Integer Range to iterate over [0:idx]
  */
  function num_of_ques(idx) {
    return new Array(idx);
  }

  /*
  When an additional question field is added, increase the number of total questions (automatically generates new blank question input box)
  field: Pass in the field which is being filled in (associated with the ng-model)
  idx: Index of the input box being filled in (should always be last one)
  */
  function question_added(field, idx) {
    if (idx + 1 == Number(field.number) && $scope.field_models[field.model][idx] != "") {
      field.number += 1;
    }
  }

  /*
  Checks whether the input box is blank, and if so, decreases the total amount of questions
  field: Pass in the field which is being filled in (associated with the ng-model)
  idx: Index of the input box being filled in
  */
  function question_blank(field, idx) {
    if (idx + 1 != Number(field.number) && $scope.field_models[field.model][idx] == "") {
      realign_questions(field, idx);
      field.number -= 1;
    }
  }

  /*
  Re-aligns all the questions if a questions is left blank
  (visually, when a has filled out a question input field already but then decides to make it blank, shuffle all the questions underneath up)

  field: Pass in the field which is being filled in (associated with the ng-model)
  idx: Index of the input box being filled in
  */
  function realign_questions(field, idx) {
    for (var i = idx; i < field.number - 1; i++) {
      $scope.field_models[field.model][i] = $scope.field_models[field.model][i + 1];
    }
  }

  // Check to see if the username exists
  var typing_timer;
  var done_typing_interval = 0;

  $scope.check_username = function (username) {
    clearTimeout(typing_timer);
    typing_timer = setTimeout(function() {
      // This executes if the user hasn't been typing for 1 second
      if (username !== '') {
        console.log(username);
        $scope.isChecking = true;
        $http.get('/api/check_username/' + username).then(function(res) {
          console.log(res);
          $scope.isChecking = false;
          if (res.data == 'available') {
            $scope.isAvailable = true;
          }
          else {
            $scope.isAvailable = false;
          }
        })
      }

    }, done_typing_interval);
  };



  function update_mongo_object () {
    var mongo_obj = {
      dashboard_id: String,
      username: $scope.username,
      form_id: String,
      files: $scope.field_models.files,
      roles: {}
    };

    //Generate pseudo unique id's for the dashboard and form
    mongo_obj.dashboard_id = create_id();
    mongo_obj.form_id = create_id();
    mongo_obj.club_name = $scope.field_models.club_name;
    mongo_obj.club_desc = $scope.field_models.club_desc;


    //Get all the general questions and store them in $scope.field_models to send to server
    for (var key in temp_roles) {
      var gen_questions = temp_roles[key]['General questions'].questions;
      mongo_obj.roles[key] = {};
      mongo_obj.roles[key]['general_ques'] = [];
      for (var i = 0; i < gen_questions.length; i++) {
        if (gen_questions[i].selected) {
          mongo_obj.roles[key]['general_ques'].push(gen_questions[i].sample);
        }
      }
      // Add additional questions to the mongo_object if they exist
      if ($scope.field_models[key + '_addition_ques']) {
        // This to convert json to an array.
        var add_ques_arr = $.map($scope.field_models[key + '_addition_ques'], function (el) {
          return el
        });
        mongo_obj.roles[key]['addition_ques'] = add_ques_arr;
      }
      else {
        mongo_obj.roles[key]['addition_ques'] = [];
      }

      // Add required files list of they are required.
      if ($scope.field_models[key + '_required_files']) {
        // This to convert json to an array.
        var req_files_arr = $.map($scope.field_models[key + '_required_files'], function (el) {
          return el
        });
        mongo_obj.roles[key]['req_files'] = req_files_arr;
      }
      else {
        mongo_obj.roles[key]['req_files'] = [];
      }
      // Add role descriptions to the roles json
      mongo_obj.roles[key]['role_desc'] = $scope.field_models[key + '_role_desc'];
    }

    $scope.mongo_obj = mongo_obj;
  }
  /*
  Function that is called when the "Create Application" button is clicked
   - make sure the generate button is inside the container form and div tags
   - Records all the relevant data in $scope.field_models
   - Performs a POST request to the server in which the server will save it to the database
   - Server returns a dashboard_id in which the page is redirected
  */
  $scope.create_dash = function() {

    update_mongo_object();
    //Upload file to Google Drive
      //Perform a POST request to the server
    console.log($scope.mongo_obj);
      $http.post('/', $scope.mongo_obj).then(function(res){
        //Server returns the dashboard id and then the following code redirects the page to the dashboard
        window.location.href = "dashboard/" + res.data.username;
      });
  };

  $scope.file_upload = null;

  // For debugging purposes
  $scope.testButton = function () {
    console.log($scope.upload_status);
    console.log($scope.field_models);
  };

  $scope.update_timeline_image = function () {
    $scope.uploading = true;
    $('.image-upload-wrap').hide();
    $('#preview_club_name').css('background-image', "url(data:" + $scope.timeline_image.type + ";base64," + $scope.timeline_image.body +")");
    $('#timeline-image > p').css('display','none');
    $('.file-upload-content').show();
    var gdrive_obj = {
      folder: 'applicants',
      data: []
    };
    gdrive_obj.data.push($scope.timeline_image);
    console.log($scope.timeline_image);
    $http.post('/google_drive', gdrive_obj).then(function (res) {
      $scope.uploading = false;
      $scope.field_models.files = res.data;
      console.log($scope.field_models);
    });
  };

  $scope.changed = function(input) {
    console.log(input);
  };
    /*
    Create a pseudo-unique id
    */
  function create_id() {
    return Math.random().toString(36).substr(2, 10);
  }
}]);
