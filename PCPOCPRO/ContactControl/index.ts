import { strict } from "assert";
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class ContactControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _container: HTMLDivElement;
    private _accountId: string;
    private _firstNameInput: HTMLInputElement;
    private _lastNameInput: HTMLInputElement;
    private _genderInput: HTMLSelectElement;
    private _dobInput: HTMLInputElement;
    private _createButton: HTMLButtonElement;
    private _cancelButton: HTMLButtonElement;
    private _contactId: string;

    private _context: ComponentFramework.Context<IInputs>;
    /**
     * Empty constructor.
     */
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public async init(
        context: ComponentFramework.Context<IInputs>, 
        notifyOutputChanged: () => void, 
        state: ComponentFramework.Dictionary, 
        container:HTMLDivElement): Promise<void>
    {
      this._context = context;
      this._container = document.createElement("div");
      container.appendChild(this._container);
      this._accountId = context.parameters.boundAccountId.raw || "";
      this._firstNameInput = this.createInputField("First Name");
      this._lastNameInput = this.createInputField("Last Name");
      this._genderInput = this.createSelectField("Gender", ["Male", "Female", "Other"]);
      this._dobInput = this.createInputField("Date of Birth", "date");
      const url = window.location.href;
      const urlObject = new URL(url);
      const idParam = urlObject.searchParams.get("id");
      this._accountId = idParam || "";
      const isGreaterThanZero = await this.retrieveAndUpdateContacts(this._accountId);
      if (isGreaterThanZero) {
          this._createButton = this.createButton("Update", this.onCreate.bind(this));
      } else {
          this._createButton = this.createButton("Create", this.onCreate.bind(this));
      }
      this._cancelButton = this.createButton("Cancel", this.onCancel.bind(this));
      this._container.appendChild(this._firstNameInput);
      this._container.appendChild(this._lastNameInput);
      this._container.appendChild(this._genderInput);
      this._container.appendChild(this._dobInput);
      this._container.appendChild(this._createButton);
      this._container.appendChild(this._cancelButton);
    }

   // Creates an input field with the specified placeholder and type
private createInputField(placeholder: string, type: string = "text"): HTMLInputElement {
    const input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    input.style.display = "block";
    input.style.marginBottom = "10px";
    return input;
}

// Creates a select field with the specified label and options
private createSelectField(label: string, options: string[]): HTMLSelectElement {
    const select = document.createElement("select");
    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.text = option;
        select.add(opt);
    });
    select.style.display = "block";
    select.style.marginBottom = "10px";
    return select;
}

// Creates a button with the specified text and click event handler
private createButton(text: string, onClick: EventListener): HTMLButtonElement {
    const button = document.createElement("button");
    button.innerText = text;
    button.onclick = onClick;
    button.style.display = "inline-block";
    button.style.marginRight = "10px";
    return button;
}

// Retrieves and updates contacts based on the dynamic value
private async retrieveAndUpdateContacts(dynamic_value: string): Promise<boolean> {
    try {
        const filter = `?$filter=_poc_accountcustom_value eq ${dynamic_value}`;
        const results = await this._context.webAPI.retrieveMultipleRecords("contact", filter);
        console.log(results);
        if (results.entities.length > 0) {
            this._firstNameInput.value = results.entities[0].firstname;
            this._lastNameInput.value = results.entities[0].lastname;
            this._dobInput.value = results.entities[0].birthdate;
            this._genderInput.value = this.getGenderString(results.entities[0].gendercode);
            this._contactId = results.entities[0].contactid;
            return true;
        } else {
            return false;
        }
    } catch (error) {
        // Handle any errors here
        return false;
    }
}

// Retrieves contacts based on the dynamic value
private async retrieveContacts(dynamic_value: string): Promise<boolean> {
    try {
        const filter = `?$filter=_poc_accountcustom_value eq ${dynamic_value}`;
        const results = await this._context.webAPI.retrieveMultipleRecords("contact", filter);
        console.log(results);
        if (results.entities.length > 0) {
            // Do something with the results
            return true;
        } else {
            return false;
        }
    } catch (error) {
        // Handle any errors here
        return false;
    }
}

private async onCreate(): Promise<void> {
  const firstName = this._firstNameInput.value;
  const lastName = this._lastNameInput.value;
  const gender = this._genderInput.value;
  const dob = this._dobInput.value;
  const isGreaterThanZero = await this.retrieveContacts(this._accountId);

  if (isGreaterThanZero) {
      if (firstName && lastName && gender && dob) {
          const recordUpd: Record<string, unknown> = {};
          recordUpd.firstname = firstName;
          recordUpd.lastname = lastName;
          recordUpd.gendercode = this.getGenderCode(gender);
          recordUpd.birthdate = dob;

          try {
              await this._context.webAPI.updateRecord("contact", this._contactId, recordUpd);
          } catch (error) {
              alert("Failed to update contact");
          }
      } else {
          alert("Please fill all fields.");
      }
  } else {
      if (firstName && lastName && gender && dob) {
          const record: Record<string, unknown> = {};
          record["poc_AccountCustom@odata.bind"] = `/poc_customaccounts(${this._accountId})`;
          record.firstname = firstName;
          record.lastname = lastName;
          record.gendercode = this.getGenderCode(gender);
          record.birthdate = dob;

          try {
              const response = await this._context.webAPI.createRecord("contact", record);
              const recordUpdate: Record<string, unknown> = {};
              recordUpdate["poc_contact@odata.bind"] = `/poc_customaccounts(${response.id})`;
              await this._context.webAPI.updateRecord("poc_customaccount", this._accountId, recordUpdate);
              alert("Contact created successfully!");
          } catch (error) {
              console.error("Error creating contact: ", error);
              alert("Failed to create contact");
          }
      } else {
          alert("Please fill all fields.");
      }
  }
}

    /**
 * Converts a gender string to its corresponding code.
 * @param {string} gender - The gender string (e.g., "male", "female", "other").
 * @returns {number} - The gender code (1 for male, 2 for female, 3 for other).
 */
private getGenderCode(gender: string): number {
  switch (gender.toLocaleLowerCase()) {
      case "male":
          return 1;
      case "female":
          return 2;
      default:
          return 3; // other
  }
}

/**
* Converts a gender code to its corresponding string.
* @param {number} gender - The gender code (1 for male, 2 for female, 3 for other).
* @returns {string} - The gender string (e.g., "Male", "Female", "Other").
*/
private getGenderString(gender: number): string {
  switch (gender) {
      case 1:
          return "Male";
      case 2:
          return "Female";
      default:
          return "Other"; // other
  }
}

/**
* Resets input fields when the "Cancel" button is clicked.
*/
private onCancel(): void {
  this._firstNameInput.value = "";
  this._lastNameInput.value = "";
  this._genderInput.value = "";
  this._dobInput.value = "";
}
    


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
       // this._accountId = context.parameters.boundAccountId.raw || "";
    }

    
    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs
    {
        return {
        };
    }

    

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
