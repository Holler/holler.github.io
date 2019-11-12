// TODO: Remove foreach for full browser support (use for(i=....))
// TODO: Switch from the graphql dependency to just use fetch 
//       https://blog.apollographql.com/4-simple-ways-to-call-a-graphql-api-a6807bcdb355
// var graph = graphql("https://network.nickoneill.com/graphql");
var graph = graphql("https://network.nickoneill.com/graphql");
var submitForm = graph(`mutation CreateFormSubmission($fk: String!, $fn: String!, $e: String!, $ce: String!) {
  createFormSubmission(formKey: $fk, firstName: $fn, email: $e, confirmedEmail: $ce){
    id
    redirectUrl
  }
}`);
var fetchForms = graph(`query FetchForms($fkeys: String!) {
  forms(formKeys: $fkeys) {
    formKey
    name
    description
  }
}`);

var modalForm = function(formKey, title, description) {
  return `
    <div class="modal_container" id='popform_${formKey}'>
      <div class="modal_body">
        <img src="/assets/images/holler-logo-nav.png" />
        <h2>${title}</h2>
        <p>
            ${description}
        </p>
        <form action='https://network.nickoneill.com/popforms/${formKey}' method='post' id='subscribe_form_${formKey}'>
          <fieldset>
            <span id='success_message_${formKey}'></span>
            <span id='error_message_${formKey}'></span>
            <input class='field' required="required" type="text" name="first_name" placeholder="First Name" id='user_first_name_${formKey}' />
            <input class='field' required="required" type="email" name="email" placeholder="Email" id='user_email_${formKey}' />
            <input class='field confirm_email' type='email' name='confirm_email' placeholder="Confirm Email" tabindex="2" id="confirm_email_${formKey}" class="input-large span10 text" />
            <input type='hidden' name='form_key' value='${formKey}' id='form_key_${formKey}' />
            <input class="submit_button" name="commit" tabindex="4" type="submit" value="Submit" id="subscribe_button_${formKey}" />
          </fieldset>
        </form>
        <span class="modal_close"></span>
      </div>
    </div>
  `;
}

var attachFormHandler = function(form) {
  var subscribeForm = document.getElementById(`subscribe_form_${form.formKey}`);
  var firstNameField = document.getElementById(`user_first_name_${form.formKey}`);
  var emailField = document.getElementById(`user_email_${form.formKey}`);
  var subscribeButton = document.getElementById(`subscribe_button_${form.formKey}`);
  var confirmEmail = document.getElementById(`confirm_email_${form.formKey}`);
  var errorMessageSpan = document.getElementById(`error_message_${form.formKey}`);
  var successMessageSpan = document.getElementById(`success_message_${form.formKey}`);
  var formKeyHidden = document.getElementById(`form_key_${form.formKey}`);
  subscribeForm.onsubmit = function(form) {
    form.preventDefault();
    subscribeButton.disabled = true;
    subscribeButton.value = "Subscribing...";
    submitForm({
      fk: formKeyHidden.value,
      fn: firstNameField.value,
      e: emailField.value,
      ce: confirmEmail.value
    }).then(function(res){
      if(res && res.createFormSubmission && res.createFormSubmission.id) {
        // Handle success
        subscribeButton.value = "Subscribed!";
        successMessageSpan.innerText = "You've been subscribed. Check your inbox to confirm.";
        errorMessageSpan.innerText = "";
      } else {
        // Handle failure
        errorMessageSpan.innerText = "Something went wrong. Please try again!";
        successMessageSpan.innerText = "";
        subscribeButton.disabled = false;
      }
    });
  };
}

var generateModal = function(form) {
  // Add the modal to the document
  var div = document.createElement('div');
  div.innerHTML = modalForm(form.formKey, form.name, form.description);
  if(document.body != null){
    document.body.appendChild(div);
    // Attach form handlers
    attachFormHandler(form);
  }
}

var popformLinks = function() {
  var formKeys = [];
  var formLinks = [];
  var distinctKeys = {};
  var links = document.getElementsByTagName("a");
  for(var i = 0; i < links.length; i++) {
    var link = links[i];
    if(/network\.nickoneill\.com\/popforms\/([0-9a-z]+)\/?$/.test(link.href)) {
      formLinks.push(link);
      var key = link.href.match(/network\.nickoneill\.com\/popforms\/([0-9a-z]+)\/?$/)[1];
      if(!distinctKeys[key]) {
        distinctKeys[key] = true;
        formKeys.push(key);
      }
    }
  }
  return {
    keys: formKeys,
    links: formLinks
  };
}

document.addEventListener("DOMContentLoaded", function() {
  var formLinks = popformLinks();
  if(formLinks.keys.length === 0)  { return; }
  
  fetchForms({
    fkeys: formLinks.keys.join(',')
  }).then(function(res){
    if(res.forms) {
      // Generate the modals
      res.forms.forEach(function(form){
        generateModal(form);
      });

      // Attach the modal dismissals
      document.querySelectorAll('.modal_container').forEach(function(item){
        item.addEventListener('click', function(event){
          if(event.target === item || event.target.className === 'modal_close') {
            item.style.display = 'none';
          }
        });
      });

      // Add the click handlers to all the links referencing the forms
      formLinks.links.forEach(function(link){
        var formKey = link.pathname.match(/popforms\/([0-9a-z]+)$/)[1];
        link.addEventListener('click', function(event){
          event.preventDefault();
          var target = document.getElementById(`popform_${formKey}`);
          target.style.display = 'block';
        });
      });
    }
  });
});