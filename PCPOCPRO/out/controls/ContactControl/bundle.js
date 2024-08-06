/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ContactControl/index.ts":
/*!*********************************!*\
  !*** ./ContactControl/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ContactControl: () => (/* binding */ ContactControl)\n/* harmony export */ });\nvar __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {\n  function adopt(value) {\n    return value instanceof P ? value : new P(function (resolve) {\n      resolve(value);\n    });\n  }\n  return new (P || (P = Promise))(function (resolve, reject) {\n    function fulfilled(value) {\n      try {\n        step(generator.next(value));\n      } catch (e) {\n        reject(e);\n      }\n    }\n    function rejected(value) {\n      try {\n        step(generator[\"throw\"](value));\n      } catch (e) {\n        reject(e);\n      }\n    }\n    function step(result) {\n      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);\n    }\n    step((generator = generator.apply(thisArg, _arguments || [])).next());\n  });\n};\nclass ContactControl {\n  /**\r\n   * Empty constructor.\r\n   */\n  constructor() {}\n  /**\r\n   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.\r\n   * Data-set values are not initialized here, use updateView.\r\n   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.\r\n   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.\r\n   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.\r\n   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.\r\n   */\n  init(context, notifyOutputChanged, state, container) {\n    return __awaiter(this, void 0, void 0, function* () {\n      this._context = context;\n      this._container = document.createElement(\"div\");\n      container.appendChild(this._container);\n      this._accountId = context.parameters.boundAccountId.raw || \"\";\n      this._firstNameInput = this.createInputField(\"First Name\");\n      this._lastNameInput = this.createInputField(\"Last Name\");\n      this._genderInput = this.createSelectField(\"Gender\", [\"Male\", \"Female\", \"Other\"]);\n      this._dobInput = this.createInputField(\"Date of Birth\", \"date\");\n      //const entityId = (context.mode as unknown).contextInfo.entityId;\n      //const entityId = (context.mode as unknown).contextInfo.entityId;\n      //   if (typeof context.mode === 'object' && 'contextInfo' in context.mode) {\n      //     const entityId = context.mode.contextInfo.entityId;\n      // }\n      var url = window.location.href;\n      //get the part after question mark with parameters list\n      //const parametersString = url;\n      var urlObject = new URL(url);\n      var idParam = urlObject.searchParams.get(\"id\");\n      // Extract the account ID from parametersObj\n      //const accountId = parametersObj[\"accountId\"] || \"\";\n      //const entityId = (context.mode as any)?.contextInfo?.entityId || '';\n      this._accountId = idParam || \"\";\n      var isGreaterThanZero = yield this.retrieveAndUpdateContacts(this._accountId);\n      if (isGreaterThanZero) {\n        this._createButton = this.createButton(\"Update\", this.onCreate.bind(this));\n      } else {\n        this._createButton = this.createButton(\"Create\", this.onCreate.bind(this));\n      }\n      this._cancelButton = this.createButton(\"Cancel\", this.onCancel.bind(this));\n      this._container.appendChild(this._firstNameInput);\n      this._container.appendChild(this._lastNameInput);\n      this._container.appendChild(this._genderInput);\n      this._container.appendChild(this._dobInput);\n      this._container.appendChild(this._createButton);\n      this._container.appendChild(this._cancelButton);\n      // const entityId = (context.mode as any).contextInfo.entityId;\n      // Add control initialization code\n    });\n  }\n  createInputField(placeholder) {\n    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : \"text\";\n    var input = document.createElement(\"input\");\n    input.type = type;\n    input.placeholder = placeholder;\n    input.style.display = \"block\";\n    input.style.marginBottom = \"10px\";\n    return input;\n  }\n  createSelectField(label, options) {\n    var select = document.createElement(\"select\");\n    options.forEach(option => {\n      var opt = document.createElement(\"option\");\n      opt.value = option;\n      opt.text = option;\n      select.add(opt);\n    });\n    select.style.display = \"block\";\n    select.style.marginBottom = \"10px\";\n    return select;\n  }\n  createButton(text, onClick) {\n    var button = document.createElement(\"button\");\n    button.innerText = text;\n    button.onclick = onClick;\n    button.style.display = \"inline-block\";\n    button.style.marginRight = \"10px\";\n    return button;\n  }\n  retrieveAndUpdateContacts(dynamic_value) {\n    return __awaiter(this, void 0, void 0, function* () {\n      try {\n        var filter = \"?$filter=_poc_accountcustom_value eq \".concat(dynamic_value);\n        var results = yield this._context.webAPI.retrieveMultipleRecords(\"contact\", filter);\n        console.log(results);\n        if (results.entities.length > 0) {\n          this._firstNameInput.value = results.entities[0].firstname;\n          this._lastNameInput.value = results.entities[0].lastname;\n          this._dobInput.value = results.entities[0].birthdate;\n          this._genderInput.value = this.getGenderString(results.entities[0].gendercode);\n          this._contactId = results.entities[0].contactid;\n          return true;\n        } else {\n          return false;\n        }\n      } catch (error) {\n        //console.error(error.message);\n        return false;\n      }\n    });\n  }\n  retrieveContacts(dynamic_value) {\n    return __awaiter(this, void 0, void 0, function* () {\n      try {\n        var filter = \"?$filter=_poc_accountcustom_value eq \".concat(dynamic_value);\n        var results = yield this._context.webAPI.retrieveMultipleRecords(\"contact\", filter);\n        console.log(results);\n        if (results.entities.length > 0) {\n          return true;\n        } else {\n          return false;\n        }\n      } catch (error) {\n        //console.error(error.message);\n        return false;\n      }\n    });\n  }\n  onCreate() {\n    return __awaiter(this, void 0, void 0, function* () {\n      var firstName = this._firstNameInput.value;\n      var lastName = this._lastNameInput.value;\n      var gender = this._genderInput.value;\n      var dob = this._dobInput.value;\n      var isGreaterThanZero = yield this.retrieveContacts(this._accountId);\n      if (isGreaterThanZero) {\n        if (firstName && lastName && gender && dob) {\n          var recordUpd = {};\n          recordUpd.firstname = firstName;\n          recordUpd.lastname = lastName;\n          recordUpd.gendercode = this.getGenderCode(gender);\n          recordUpd.birthdate = dob;\n          try {\n            var response = yield this._context.webAPI.updateRecord(\"contact\", this._contactId, recordUpd);\n          } catch (error) {\n            alert(\"Failed to update contact\");\n          }\n        } else {\n          alert(\"Please fill all fields.\");\n        }\n      } else {\n        if (firstName && lastName && gender && dob) {\n          var record = {};\n          record[\"poc_AccountCustom@odata.bind\"] = \"/poc_customaccounts(\".concat(this._accountId, \")\");\n          // Set other properties\n          record.firstname = firstName;\n          record.lastname = lastName;\n          record.gendercode = this.getGenderCode(gender);\n          record.birthdate = dob;\n          try {\n            var _response = yield this._context.webAPI.createRecord(\"contact\", record);\n            var recordUpdate = {};\n            recordUpdate[\"poc_contact@odata.bind\"] = \"/poc_customaccounts(\".concat(_response.id, \")\");\n            var response2 = yield this._context.webAPI.updateRecord(\"poc_customaccount\", this._accountId, recordUpdate);\n            alert(\"Contact created successfully!\");\n          } catch (error) {\n            console.error(\"error creating contact \", error);\n            alert(\"Failed to create contact\");\n          }\n        } else {\n          alert(\"Please fill all fields.\");\n        }\n      }\n    });\n  }\n  getGenderCode(gender) {\n    switch (gender.toLocaleLowerCase()) {\n      case \"male\":\n        return 1;\n      case \"female\":\n        return 2;\n      default:\n        return 3;\n      //other\n    }\n  }\n  getGenderString(gender) {\n    switch (gender) {\n      case 1:\n        return \"Male\";\n      case 2:\n        return \"Female\";\n      default:\n        return \"Other\";\n      //other\n    }\n  }\n  onCancel() {\n    this._firstNameInput.value = \"\";\n    this._lastNameInput.value = \"\";\n    this._genderInput.value = \"\";\n    this._dobInput.value = \"\";\n  }\n  /**\r\n   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.\r\n   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions\r\n   */\n  updateView(context) {\n    // this._accountId = context.parameters.boundAccountId.raw || \"\";\n  }\n  /**\r\n   * It is called by the framework prior to a control receiving new data.\r\n   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as \"bound\" or \"output\"\r\n   */\n  getOutputs() {\n    return {};\n  }\n  /**\r\n   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.\r\n   * i.e. cancelling any pending remote calls, removing listeners, etc.\r\n   */\n  destroy() {\n    // Add code to cleanup control if necessary\n  }\n}\n\n//# sourceURL=webpack://pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad/./ContactControl/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./ContactControl/index.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = __webpack_exports__;
/******/ 	
/******/ })()
;
if (window.ComponentFramework && window.ComponentFramework.registerControl) {
	ComponentFramework.registerControl('POCProMxContact.ContactControl', pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.ContactControl);
} else {
	var POCProMxContact = POCProMxContact || {};
	POCProMxContact.ContactControl = pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.ContactControl;
	pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = undefined;
}