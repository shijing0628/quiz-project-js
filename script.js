//--------------Quiz Controller
var quizController = (function () {
  // question constructor

  function Question(id, questionText, options, correctAnswer) {
    this.id = id;
    this.questionText = questionText;
    this.options = options;
    this.correctAnswer = correctAnswer;
  }

  // create local storage internal for store data
  var questionOnLocalStorage = {
    setQuestionCollection: function (newCollection) {
      localStorage.setItem("questionCollection", JSON.stringify(newCollection));
    },

    getQuestionCollection: function () {
      return JSON.parse(localStorage.getItem("questionCollection"));
    },

    removeQuestionCollection: function () {
      localStorage.removeItem("questionCollection");
    },
  };
  // Quiz progress bar section
  var quizProgress = {
    questionIndex: 0,
  };

  //--- person constructor

  function Person(id, firstname, lastname, score) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.score = score;
  }

  var currPersonData = {
    fullName: [],
    score: 0,
  };

  var adminFullName = ["John", "Smith"];

  var personLocalStorage = {
    setPersonData: function (newPersonData) {
      localStorage.setItem("personData", JSON.stringify(newPersonData));
    },
    getPersonData: function () {
      return JSON.parse(localStorage.getItem("personData"));
    },
    removePersonData: function () {
      localStorage.removeItem("personData");
    },
  };

  if (personLocalStorage.getPersonData() === null) {
    personLocalStorage.setPersonData([]);
  }

  return {
    getQuizProgress: quizProgress,
    // get question from local storage
    getQuestionStorage: questionOnLocalStorage,

    // add data to local storage
    addQuestionOnLocalStorage: function (newQuestText, opts) {
      var optionsArr,
        correctAns,
        questionId,
        newQuestion,
        getStoredQuests,
        isChecked;

      // in case at beginning local storage is empty
      if (questionOnLocalStorage.getQuestionCollection() === null) {
        questionOnLocalStorage.setQuestionCollection([]);
      }
      isChecked = false;
      optionsArr = [];
      //questionId = 0;
      for (let opt of opts) {
        if (opt.value !== "") {
          optionsArr.push(opt.value);
        }
        if (opt.previousElementSibling.checked && opt.value !== "") {
          correctAns = opt.value;
          isChecked = true;
        }
      }
      //console.log(correctAns);

      // define unquie ID
      if (questionOnLocalStorage.getQuestionCollection().length > 0) {
        questionId =
          questionOnLocalStorage.getQuestionCollection()[
            questionOnLocalStorage.getQuestionCollection().length - 1
          ].id + 1;
      } else {
        questionId = 0;
      }

      if (newQuestText.value !== "") {
        if (optionsArr.length > 1) {
          if (isChecked) {
            // new Obj newQuestion
            newQuestion = new Question(
              questionId,
              newQuestText.value,
              optionsArr,
              correctAns
            );

            getStoredQuests = questionOnLocalStorage.getQuestionCollection();
            getStoredQuests.push(newQuestion);
            questionOnLocalStorage.setQuestionCollection(getStoredQuests);

            // make text area.opt, check radio clear
            newQuestText.value = "";
            for (let opt of opts) {
              opt.value = "";
              opt.previousElementSibling.checked = false;
            }

            //console.log(newQuestion);
            return true;
          } else {
            alert("please check correct answer");
            return false;
          }
        } else {
          alert("please insert at least 2 options");
          return false;
        }
      } else {
        alert("please insert question");
        return false;
      }
    },

    // check the answer in UI controller
    checkAnswer: function (ans) {
      if (
        questionOnLocalStorage.getQuestionCollection()[
          quizProgress.questionIndex
        ].correctAnswer === ans.textContent
      ) {
        currPersonData.score++;
        return true;
      } else {
        return false;
      }
    },
    // check quiz finish
    isFinished: function () {
      return (
        quizProgress.questionIndex + 1 ===
        questionOnLocalStorage.getQuestionCollection().length
      );
    },

    // add a person
    addPerson: function () {
      var newPerson, personId, personData;

      // get Person ID
      if (personLocalStorage.getPersonData().length > 0) {
        personId =
          personLocalStorage.getPersonData()[
            personLocalStorage.getPersonData().length - 1
          ].id + 1;
      } else {
        personId = 0;
      }

      newPerson = new Person(
        personId,
        currPersonData.fullName[0],
        currPersonData.fullName[1],
        currPersonData.score
      );
      personData = personLocalStorage.getPersonData();
      personData.push(newPerson);
      personLocalStorage.setPersonData(personData);
    },

    getCurrPersonData: currPersonData,
    getAdminFullName: adminFullName,
    getPersonLocalStorage: personLocalStorage,
  };
})();

//--------------UI Controller
var UIController = (function () {
  var domItems = {
    // admin pannel element
    adminSection: document.querySelector(".admin-panel-container"),
    questInsertBtn: document.getElementById("question-insert-btn"),
    newQuestionText: document.getElementById("new-question-text"),
    adminOptions: document.querySelectorAll(".admin-option"),
    adminOptionsContainer: document.querySelector(".admin-options-container"),
    insertedQuestsWrapper: document.querySelector(
      ".inserted-questions-wrapper"
    ),
    questUpdateBtn: document.getElementById("question-update-btn"),
    questDeleteBtn: document.getElementById("question-delete-btn"),
    questsClearBtn: document.getElementById("questions-clear-btn"),
    resultListWrapper: document.querySelector(".results-list-wrapper"),
    clearResultBtn: document.getElementById("results-clear-btn"),

    //-----quiz section
    quizSection: document.querySelector(".quiz-container"),
    askedQuestText: document.getElementById("asked-question-text"),
    quizOptionsWrapper: document.querySelector(".quiz-options-wrapper"),
    progressBar: document.querySelector("progress"),
    progressPar: document.getElementById("progress"),
    instAnsContainer: document.querySelector(".instant-answer-container"),
    instAnsText: document.getElementById("instant-answer-text"),
    instAnsDiv: document.getElementById("instant-answer-wrapper"),
    emotionIcon: document.getElementById("emotion"),
    nextQuestBtn: document.getElementById("next-question-btn"),

    //--------landing page
    landPageSection: document.querySelector(".landing-page-container"),
    startQuizBtn: document.getElementById("start-quiz-btn"),
    firstNameInput: document.getElementById("firstname"),
    lastNameInput: document.getElementById("lastname"),

    //---------final result
    finalSection: document.querySelector(".final-result-container"),
    finalScoreText: document.getElementById("final-score-text"),
  };

  return {
    getDomItems: domItems,

    addInputDynamically: function () {
      var addInput = function () {
        var inputHTML = "";
        var z;

        z = document.querySelectorAll(".admin-option").length;

        inputHTML = `<div class="admin-option-wrapper">
        <input type = "radio" class="admin-option-${z}" name = "answer" value = "1" >
          <input type="text" class="admin-option admin-option-${z}" value="">
            </div>`;

        // insert new option line
        domItems.adminOptionsContainer.insertAdjacentHTML(
          "beforeend",
          inputHTML
        );

        //remove event listner to the previous foucs item
        domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener(
          "foucs",
          addInput
        );

        domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener(
          "focus",
          addInput
        );
      };

      domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener(
        "focus",
        addInput
      );
    },

    //question list

    createQuestionList: function (getQuestions) {
      //console.log(getQuestions);
      //clear all question list

      var questHTML;
      domItems.insertedQuestsWrapper.innerHTML = "";

      // in case at beginning local storage is empty
      if (getQuestions.getQuestionCollection() === null) {
        getQuestions.setQuestionCollection([]);
      }

      // Display each item into question list area
      getQuestions.getQuestionCollection().forEach((getQuestion, index) => {
        questHTML = `<p><span>${index + 1} ${
          getQuestion.questionText
        }</span><button id="question-${getQuestion.id}">Edit</button></p>`;

        domItems.insertedQuestsWrapper.insertAdjacentHTML(
          "afterbegin",
          questHTML
        );
      });
    },

    // edit question list UI part, only click "edit" this button
    editQuestList: function (
      event,
      storageQuestList,
      addInputDy,
      updateQuestionList
    ) {
      var getId,
        getStorageQuestList,
        foundItem = [],
        placeInArr;

      if ("question-".indexOf(event.target.id)) {
        // get ID
        getId = parseInt(event.target.id.split("-")[1]);

        getStorageQuestList = storageQuestList.getQuestionCollection();

        // find same Id of click that item in local storage
        foundItem = getStorageQuestList.filter((item) => {
          return getStorageQuestList.indexOf(item) === getId;
        });

        placeInArr = foundItem[0].id;

        //console.log(foundItem[0], placeInArr);

        // Display it on question text area
        domItems.newQuestionText.value = foundItem[0].questionText;

        domItems.adminOptionsContainer.innerHTML = "";

        // gather options which needs to edit
        var optionHTML = "";
        for (let i = 0; i < foundItem[0].options.length; i++) {
          optionHTML += `<div class="admin-option-wrapper">
                  <input type="radio" class="admin-option-${i}" name="answer" value="1">
                  <input type="text" class="admin-option admin-option-${i}" value="${foundItem[0].options[i]}">
              </div>`;
          domItems.adminOptionsContainer.innerHTML = optionHTML;

          // display update and delete button and hide insert button
          domItems.questUpdateBtn.style.visibility = "visible";
          domItems.questDeleteBtn.style.visibility = "visible";
          domItems.questInsertBtn.style.visibility = "hidden";

          //disable clear button
          domItems.questsClearBtn.style.pointerEvents = "none";

          // Fix issue for dynamic input after click edit button
          addInputDy();

          var backDefaultView = function () {
            var updatedOptions = document.querySelectorAll(".admin-option");
            //clear all inputs
            domItems.newQuestionText.value = "";
            for (let option of updatedOptions) {
              option.value = "";
              option.previousElementSibling.checked = false;
            }
            // disable update and delete button and display insert button
            domItems.questUpdateBtn.style.visibility = "hidden";
            domItems.questDeleteBtn.style.visibility = "hidden";
            domItems.questInsertBtn.style.visibility = "visible";
            domItems.questsClearBtn.style.pointerEvents = "";

            // update info to the question list no need refresh page
            updateQuestionList(storageQuestList);
          };

          //update button event to local storage
          var updateQuestion = function () {
            var newOptions = [];
            var optionEls;
            optionEls = document.querySelectorAll(".admin-option");

            foundItem[0].questionText = domItems.newQuestionText.value;

            foundItem[0].correctAnswer = "";

            for (let opt of optionEls) {
              if (opt !== "") {
                newOptions.push(opt.value);
                if (opt.previousElementSibling.checked) {
                  foundItem[0].correctAnswer = opt.value;
                }
              }
            }
            foundItem[0].options = newOptions;

            if (foundItem[0].questionText !== "") {
              if (foundItem[0].options.length > 1) {
                if (foundItem[0].correctAnswer !== "") {
                  //write into local storage, splice()
                  getStorageQuestList.splice(placeInArr, 1, foundItem[0]);
                  storageQuestList.setQuestionCollection(getStorageQuestList);
                  backDefaultView();
                } else {
                  alert("must check correct answer");
                }
              } else {
                alert("please input more than 1 option");
              }
            } else {
              alert("please input question");
            }
          };
          domItems.questUpdateBtn.onclick = updateQuestion;

          //Delete question section
          var deleteQuestion = function () {
            getStorageQuestList.splice(placeInArr, 1);
            storageQuestList.setQuestionCollection(getStorageQuestList);
            backDefaultView();
          };

          domItems.questDeleteBtn.onclick = deleteQuestion;
        }
      }
    },

    // warining and then remove all list
    clearQuestList: function (storageQuestList) {
      if (storageQuestList.getQuestionCollection() !== null) {
        if (storageQuestList.getQuestionCollection().length > 0) {
          var conf = confirm("warining! Will remove all items");

          if (conf) {
            storageQuestList.removeQuestionCollection();
            // update info to the question list no need refresh page
            domItems.insertedQuestsWrapper.innerHTML = "";
          }
        }
      }
    },

    //----------- Answer question section
    DisplayQuestion: function (storageQuestList, progress) {
      if (storageQuestList.getQuestionCollection().length > 0) {
        var newOptionHTML = "";
        var charactorArr = ["A", "B", "C", "D", "E"];
        // get quiz question
        domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[
          progress.questionIndex
        ].questionText;

        //get quiz options and display them
        domItems.quizOptionsWrapper.innerHTML = "";

        for (
          let i = 0;
          i <
          storageQuestList.getQuestionCollection()[progress.questionIndex]
            .options.length;
          i++
        ) {
          newOptionHTML = `<div class="choice-${i}"><span class="choice-${i}">${
            charactorArr[i]
          }</span><p class="choice-${i}">${
            storageQuestList.getQuestionCollection()[progress.questionIndex]
              .options[i]
          }</p></div>`;

          domItems.quizOptionsWrapper.insertAdjacentHTML(
            "beforeend",
            newOptionHTML
          );
        }
      }
    },

    // Display quiz section progress
    displayProgress: function (storageQuestList, progress) {
      domItems.progressBar.max = storageQuestList.getQuestionCollection().length;
      domItems.progressBar.value = progress.questionIndex + 1;

      domItems.progressPar.textContent =
        progress.questionIndex + 1 + "/" + domItems.progressBar.max;
    },

    // Quiz section on the top display correct answer or not
    newDesign: function (ansResult, selecedAns) {
      var twoOptions = {
        instAnswerText: ["this is a wrong answer", "this is a correct answer"],
        instAnswerClass: ["red", "green"],
        emotionType: ["images/sad.png", "images/happy.png"],
        iptionSpanBg: ["rgba(200,0,0,0.7)", "rgba(0,250,0,0.2)"],
      };

      var index = 0;

      if (ansResult) {
        index = 1;
      }
      // Disable choices
      domItems.quizOptionsWrapper.style.cssText =
        "opacity:0.6; pointer-events:none;";
      domItems.instAnsContainer.style.opacity = "1";

      domItems.instAnsText.textContent = twoOptions.instAnswerText[index];
      //change answer background
      domItems.instAnsDiv.className = twoOptions.instAnswerClass[index];
      //change emoji
      domItems.emotionIcon.setAttribute("src", twoOptions.emotionType[index]);
      //spanBG color
      selecedAns.previousElementSibling.style.backgroundColor =
        twoOptions.iptionSpanBg[index];
    },

    // reset design before move to next question
    resetDesign: function () {
      domItems.quizOptionsWrapper.style.cssText = "";
      domItems.instAnsContainer.style.opacity = "0";
    },

    // get full name in landing page
    getFullName: function (currPerson, storageQuestList, admin) {
      // cannot empty input for names
      if (
        domItems.firstNameInput.value !== "" &&
        domItems.lastNameInput.value !== ""
      ) {
        // if input name == john smith then he can go to admin pannel
        if (
          !(
            domItems.firstNameInput.value === admin[0] &&
            domItems.lastNameInput.value === admin[1]
          )
        ) {
          if (storageQuestList.getQuestionCollection().length > 0) {
            currPerson.fullName.push(domItems.firstNameInput.value);
            currPerson.fullName.push(domItems.lastNameInput.value);

            // start quiz section, hide landing page
            domItems.landPageSection.style.display = "none";
            domItems.quizSection.style.display = "block";
          } else {
            alert("quiz is not ready...");
          }
        } else {
          domItems.landPageSection.style.display = "none";
          domItems.adminSection.style.display = "block";
        }
      } else {
        alert("please enter first name and last name");
      }
    },

    // final result display
    finalResult: function (currPerson) {
      domItems.finalScoreText.textContent =
        currPerson.fullName[0] +
        " " +
        currPerson.fullName[1] +
        ", your final score is " +
        currPerson.score;

      domItems.quizSection.style.display = "none";
      domItems.finalSection.style.display = "block";
    },

    // display result in admin pannel
    addResultOnPannel: function (userData) {
      var resultHTML = "";
      domItems.resultListWrapper.innerHTML = "";
      for (i = 0; i < userData.getPersonData().length; i++) {
        resultHTML = `<p class="person person-${i}"><span class="person-${i}">${
          userData.getPersonData()[i].firstname
        }${userData.getPersonData()[i].lastname} - ${
          userData.getPersonData()[i].score
        } Points</span><button id="delete-result-btn_${
          userData.getPersonData()[i].id
        }" class="delete-result-btn">Delete</button></p>`;

        domItems.resultListWrapper.insertAdjacentHTML("afterbegin", resultHTML);
      }
    },
    // delete result
    deleteResult: function (event, userData) {
      var getId, personsArr;
      personsArr = userData.getPersonData();
      if ("delete-result-btn_".indexOf(event.target.id)) {
        getId = parseInt(event.target.id.split("_")[1]);
      }

      // use splice delete item depending on index
      for (var i = 0; i < personsArr.length; i++) {
        if (personsArr[i].id === getId) {
          personsArr.splice(i, 1);
          userData.setPersonData(personsArr);
        }
      }
    },

    //clear all result
    clearResultList: function (userData) {
      if (userData.getPersonData() !== null) {
        if (userData.getPersonData().length > 0) {
          var conf = confirm("waring: are you sure delete all list info?");
          if (conf) {
            userData.removePersonData();
            domItems.resultListWrapper.innerHTML = "";
          }
        }
      }
    },
  };
})();

//--------------Whole Controller
var controller = (function (quizCtrl, UICtrl) {
  var selectedDomItems = UICtrl.getDomItems;

  UICtrl.addInputDynamically();

  //Every time when refresh page, all questions are listed in that area
  UICtrl.createQuestionList(quizCtrl.getQuestionStorage);

  selectedDomItems.questInsertBtn.addEventListener("click", function () {
    // add new option to local storage, otherwise only UI controller has this info

    var adminOptions = document.querySelectorAll(".admin-option");

    // If there is an item added, addQuestionOnLocalStorage return true, then display at
    // the following question list area

    var checkBoolean = quizCtrl.addQuestionOnLocalStorage(
      selectedDomItems.newQuestionText,
      //selectedDomItems.adminOptions
      adminOptions
    );
    if (checkBoolean) {
      UICtrl.createQuestionList(quizCtrl.getQuestionStorage);
    }
  });

  // edit button to update each question content
  selectedDomItems.insertedQuestsWrapper.addEventListener("click", function (
    e
  ) {
    UICtrl.editQuestList(
      e,
      quizCtrl.getQuestionStorage,
      UICtrl.addInputDynamically,
      UICtrl.createQuestionList
    );
  });

  // clear button
  selectedDomItems.questsClearBtn.addEventListener("click", function () {
    UICtrl.clearQuestList(quizCtrl.getQuestionStorage);
  });

  // Display question in quiz section
  UICtrl.DisplayQuestion(quizCtrl.getQuestionStorage, quizCtrl.getQuizProgress);

  //show progress in quiz section
  UICtrl.displayProgress(quizCtrl.getQuestionStorage, quizCtrl.getQuizProgress);

  // quiz section check correct answer
  selectedDomItems.quizOptionsWrapper.addEventListener("click", function (e) {
    var updateOptionDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll(
      "div"
    );

    for (let i = 0; i < updateOptionDiv.length; i++) {
      if (e.target.className === "choice-" + i) {
        //console.log(e.target.className);

        var answer = document.querySelector(
          ".quiz-options-wrapper div p." + e.target.className
        );

        var answerResult = quizCtrl.checkAnswer(answer);

        //display
        UICtrl.newDesign(answerResult, answer);

        //next question part
        var nextQuestion = function (questData, progress) {
          if (quizCtrl.isFinished()) {
            quizCtrl.addPerson();

            // final result
            UICtrl.finalResult(quizCtrl.getCurrPersonData);

            //finish quiz change button to "finish"
            selectedDomItems.nextQuestBtn.textContent = "Finish";
          } else {
            UICtrl.resetDesign();
            quizCtrl.getQuizProgress.questionIndex++;
            // Display next question in quiz section
            UICtrl.DisplayQuestion(
              quizCtrl.getQuestionStorage,
              quizCtrl.getQuizProgress
            );
            // update prgress bar
            UICtrl.displayProgress(
              quizCtrl.getQuestionStorage,
              quizCtrl.getQuizProgress
            );
          }
        };
        selectedDomItems.nextQuestBtn.onclick = function () {
          nextQuestion(quizCtrl.getQuestionStorage, quizCtrl.getQuizProgress);
        };
      }
    }
  });

  // landing page start quiz event
  selectedDomItems.startQuizBtn.addEventListener("click", function () {
    UICtrl.getFullName(
      quizCtrl.getCurrPersonData,
      quizCtrl.getQuestionStorage,
      quizCtrl.getAdminFullName
    );
  });

  // when input last name and press enter
  selectedDomItems.lastNameInput.addEventListener("focus", function () {
    selectedDomItems.lastNameInput.addEventListener("keypress", function (e) {
      if (e.keyCode === 13) {
        UICtrl.getFullName(
          quizCtrl.getCurrPersonData,
          quizCtrl.getQuestionStorage,
          quizCtrl.getAdminFullName
        );
      }
    });
  });

  UICtrl.addResultOnPannel(quizCtrl.getPersonLocalStorage);

  // delete users quiz in admin pannel
  selectedDomItems.resultListWrapper.addEventListener("click", function (e) {
    UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);
    UICtrl.addResultOnPannel(quizCtrl.getPersonLocalStorage);
  });

  //clear all result
  selectedDomItems.clearResultBtn.addEventListener("click", function () {
    UICtrl.clearResultList(quizCtrl.getPersonLocalStorage);
  });
})(quizController, UIController);
