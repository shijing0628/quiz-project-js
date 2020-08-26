//----------------Quiz Controller----------------

var quizController = (function () {
  //   var private = 10;
  //   var privateFn = function (a) {
  //     return a + private;
  //   };
  //   return {
  //     publicMethod: function () {
  //       return privateFn(20);
  //     },
  //   };

  //Qestion Constructor
  function Question(id, questionText, options, correctAnswer) {
    this.id = id;
    this.questionText = questionText;
    this.options = options;
    this.correctAnswer = correctAnswer;
  }

  // create local storage for question collection
  var questionLocalStorage = {
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

  // if local storage is empty
  if (questionLocalStorage.getQuestionCollection() === null) {
    questionLocalStorage.setQuestionCollection([]);
  }

  var quizProgress = {
    questionIndex: 0,
  };

  // return function addQuestionOnLocalStorage() can be called by gobal controller function
  return {
    getQuizProgress: quizProgress,
    getQuestionStorage: questionLocalStorage,
    addQuestionOnLocalStorage: function (newQuestText, opts) {
      var optionsArr = [];
      var corrAns, questionId, newQuestion, getStoredQuests, isChecked;
      isChecked = false;

      for (var i = 0; i < opts.length; i++) {
        if (opts[i].value !== "") {
          optionsArr.push(opts[i].value);
        }
        if (opts[i].previousElementSibling.checked && opts[i].value !== "") {
          corrAns = opts[i].value;
          isChecked = true;
        }
      }
      //console.log(optionsArr);
      //console.log(corrAns);

      //------edit ID-------------//
      //[{id:0} {id:1} {id:2}]
      if (questionLocalStorage.getQuestionCollection().length > 0) {
        questionId =
          questionLocalStorage.getQuestionCollection()[
            questionLocalStorage.getQuestionCollection().length - 1
          ].id + 1;
      } else {
        questionId = 0;
      }

      // new an object from constructor Question, consider empty input conditions
      if (newQuestText.value !== "") {
        if (optionsArr.length > 1) {
          if (isChecked) {
            newQuestion = new Question(
              questionId,
              newQuestText.value,
              optionsArr,
              corrAns
            );
            // store new question collection
            getStoredQuests = questionLocalStorage.getQuestionCollection();

            getStoredQuests.push(newQuestion);

            questionLocalStorage.setQuestionCollection(getStoredQuests);

            // clear input area after click 'insert' button
            newQuestText.value = "";
            for (var x = 0; x < opts.length; x++) {
              opts[x].value = "";
              opts[x].previousElementSibling.checked = false;
            }

            // console.log(getStoredQuests);
            return true;
          } else {
            alert("please check option!");
            return false;
          }
        } else {
          alert("please must insert at least 2 options!");
          return false;
        }
      } else {
        alert("please insert question!");
        return false;
      }
    },
  };
})();

//----------------UI Controller----------------//

var UIController = (function () {
  //   var num1 = 30;
  //   return {
  //     sum: function (num2) {
  //       return num1 + num2;
  //     },
  //   };

  var domItems = {
    //--------Admin Panel Elements---------------//
    questInsertBtn: document.getElementById("question-insert-btn"),
    newQuestionText: document.getElementById("new-question-text"),
    adminOptions: document.querySelectorAll(".admin-option"),
    adminOptionContainer: document.querySelector(".admin-options-container"),
    insertQuestsWrapper: document.querySelector(".inserted-questions-wrapper"),
    questUpdateBtn: document.getElementById("question-update-btn"),
    questDeleteBtn: document.getElementById("question-delete-btn"),
    questClearBtn: document.getElementById("questions-clear-btn"),

    // --------quiz display
    askedQuestText: document.getElementById("asked-question-text"),
    quizOptionsWrapper: document.querySelector(".quiz-options-wrapper"),
  };
  return {
    getDomItems: domItems,

    // dyniamc add input line when foucs last itme
    addInputDynamically: function () {
      var addInput = function () {
        var inputHTML;
        var z = document.querySelectorAll(".admin-option").length;
        inputHTML = `<div class="admin-option-wrapper">
          <input type = "radio" class="admin-option-${z}" name = "answer" value = "1" >
            <input type="text" class="admin-option admin-option-${z}" value="">
              </div>`;
        domItems.adminOptionContainer.insertAdjacentHTML(
          "beforeend",
          inputHTML
        );
        //remove event listner to the previous foucs item
        domItems.adminOptionContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener(
          "foucs",
          addInput
        );
        // move event listener to current focus item
        domItems.adminOptionContainer.lastElementChild.lastElementChild.addEventListener(
          "focus",
          addInput
        );
      };
      domItems.adminOptionContainer.lastElementChild.lastElementChild.addEventListener(
        "focus",
        addInput
      );
    },

    // Add question to questionlist
    createQuesitonList: function (getQuestions) {
      var questionHTML;
      var numberingArr = [];
      var placeInArr;
      var foundItem, optionHTML;
      domItems.insertQuestsWrapper.innerHTML = "";
      for (let i = 0; i < getQuestions.getQuestionCollection().length; i++) {
        numberingArr.push(i + 1);
        questionHTML = `<p><span>${numberingArr[i]}.${
          getQuestions.getQuestionCollection()[i].questionText
        }</span><button id="question-${
          getQuestions.getQuestionCollection()[i].id
        }">Edit</button></p>`;

        domItems.insertQuestsWrapper.insertAdjacentHTML(
          "afterbegin",
          questionHTML
        );
      }
    },
    // Edit question list when click edit button
    editQuestList: function (
      event,
      storageQuestList,
      addInpsDynFn,
      updateQuestionFn
    ) {
      if ("question-".indexOf(event.target.id)) {
        //find edit item ID
        getId = parseInt(event.target.id.split("-")[1]);

        getStoreQuestList = storageQuestList.getQuestionCollection();

        for (var i = 0; i < getStoreQuestList.length; i++) {
          if (getStoreQuestList[i].id === getId) {
            foundItem = getStoreQuestList[i];
            placeInArr = i;
          }
        }

        // display selected item content to question text area
        domItems.newQuestionText.value = foundItem.questionText;
        domItems.adminOptionContainer.innerHTML = "";
        optionHTML = "";
        for (var x = 0; x < foundItem.options.length; x++) {
          optionHTML += ` <div class="admin-option-wrapper">
                  <input type="radio" class="admin-option-${x}" name="answer" value="0">
                  <input type="text" class="admin-option admin-option-${x}" value="${foundItem.options[x]}">
              </div>`;
        }

        // Display selected item options when we want edit item
        domItems.adminOptionContainer.innerHTML = optionHTML;

        // Hide insert Button but display Update and delete button
        domItems.questUpdateBtn.style.visibility = "visible";
        domItems.questDeleteBtn.style.visibility = "visible";
        domItems.questInsertBtn.style.visibility = "hidden";
        domItems.questClearBtn.style.pointerEvents = "none";

        addInpsDynFn();

        //
        var backDefaultView = function () {
          var updatedOptions;

          //clear text content and option content
          domItems.newQuestionText.value = "";
          updatedOptions = document.querySelectorAll(".admin-option");

          for (var i = 0; i < updatedOptions.length; i++) {
            updatedOptions[i].value = "";
            updatedOptions[i].previousElementSibling.checked = "false";
          }

          //display buttons updated after edit
          domItems.questUpdateBtn.style.visibility = "hidden";
          domItems.questDeleteBtn.style.visibility = "hidden";
          domItems.questInsertBtn.style.visibility = "visible";
          domItems.questClearBtn.style.pointerEvents = "";

          updateQuestionFn(storageQuestList);
        };

        // click update button then question content updated
        var updateQuestion = function () {
          var newOptions = [];
          var optionEls;

          optionEls = document.querySelectorAll(".admin-option");

          foundItem.questionText = domItems.newQuestionText.value;
          foundItem.correctAnswer = "";

          //update options and correct answer option
          for (var i = 0; i < optionEls.length; i++) {
            if (optionEls[i].value !== "") {
              newOptions.push(optionEls[i].value);

              if (optionEls[i].previousElementSibling.checked) {
                foundItem.correctAnswer = optionEls[i].value;
              }
            }
          }
          foundItem.options = newOptions;

          if (foundItem.questionText !== "") {
            if (foundItem.options.length > 1) {
              if (foundItem.correctAnswer !== "") {
                // splice is for change item content in array splice(index,number,update-content)
                getStoreQuestList.splice(placeInArr, 1, foundItem);

                //update local storage content
                storageQuestList.setQuestionCollection(getStoreQuestList);

                backDefaultView();
              } else {
                alert("please choose correct answer");
              }
            } else {
              alert("please insert > 2 options");
            }
          } else {
            alert("please insert question");
          }
        };

        // update button event
        domItems.questUpdateBtn.onclick = updateQuestion;

        var deleteQuestion = function () {
          getStoreQuestList.splice(placeInArr, 1);
          storageQuestList.setQuestionCollection(getStoreQuestList);
          backDefaultView();
        };

        // Delete button event
        domItems.questDeleteBtn.onclick = deleteQuestion;
      }
    },

    // clear all questions function
    clearQuestList: function (storageQuestList) {
      if (storageQuestList.getQuestionCollection() !== null) {
        if (storageQuestList.getQuestionCollection().length > 0) {
          var conf = confirm("warning! You will lose entire question list");

          if (conf) {
            storageQuestList.removeQuestionCollection();

            domItems.insertQuestsWrapper.innerHTML = "";
          }
        }
      }
    },

    // display question list section

    displayQuestion: function (storageQuestList, progress) {
      if (storageQuestList.getQuestionCollection().length > 0) {
        //question text title display
        domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[
          progress.questionIndex
        ].questionText;

        //clear display section options
        domItems.quizOptionsWrapper.innerHTML = "";

        //Display options
        var newOptionHTML = "";

        var CharactorArr = ["A", "B", "C", "D", "E", "F"];
        for (
          var i = 0;
          i <
          storageQuestList.getQuestionCollection()[progress.questionIndex]
            .options.length;
          i++
        ) {
          newOptionHTML = ` <div class="choice-${i}"><span class="choice-0">${
            CharactorArr[i]
          }</span><p  class="choice-${i}">${
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
  };
})();

//----------------Whole Controller----------------
//**************************************************/

var controller = (function (quizCtrl, UICtrl) {
  // console.log(UICtrl.sum(100) + quizCtrl.publicMethod());
  var selectedDomItems = UICtrl.getDomItems;

  UICtrl.addInputDynamically();

  // Add question to questionlist
  UICtrl.createQuesitonList(quizCtrl.getQuestionStorage);

  selectedDomItems.questInsertBtn.addEventListener("click", function () {
    // fix issue : extra added item cannot save to local storage
    //and won't be removed in the front. JS only know the orignal options

    var adminOptions = document.querySelectorAll(".admin-option");

    var checkBoolean = quizCtrl.addQuestionOnLocalStorage(
      selectedDomItems.newQuestionText,
      adminOptions
    );

    // Don't need refresh page, once add item, it will show in the question list
    if (checkBoolean) {
      UICtrl.createQuesitonList(quizCtrl.getQuestionStorage);
    }
  });

  selectedDomItems.insertQuestsWrapper.addEventListener("click", function (e) {
    UICtrl.editQuestList(
      e,
      quizCtrl.getQuestionStorage,
      UICtrl.addInputDynamically,
      UICtrl.createQuesitonList
    );
  });
  selectedDomItems.questClearBtn.addEventListener("click", function () {
    UICtrl.clearQuestList(quizCtrl.getQuestionStorage);
  });

  UICtrl.displayQuestion(quizCtrl.getQuestionStorage, quizCtrl.getQuizProgress);
})(quizController, UIController);
