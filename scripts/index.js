const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const adminItems = document.querySelectorAll('.admin-actions');
const accountDetails = document.querySelector('.account-details');

const setupUI = (user) => {
  if (user){
    //user details
    if (user.admin) {
      adminItems.forEach(item => item.style.display = 'block');
    }


    db.collection('users').doc(user.uid).get().then( doc => {
      const bio = doc.data()? doc.data().bio:'';
      const adminStatus = user.admin? 'Admin' : '';
      const htlm = `
      <div> Logged in as ${user.email}</div>
      <div> ${bio}</div>
      <div class="pink-text"> ${adminStatus}</div>
      `;
      accountDetails.innerHTML = htlm;
      //toggle UI elements
      loggedInLinks.forEach(item => item.style.display = 'block');
      loggedOutLinks.forEach(item => item.style.display = 'none');
    });
    
  }else{
    adminItems.forEach(item => item.style.display = 'none');
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');

    //clean up user details
    accountDetails.innerHTML = '';
  }
}

const setupGuides = (data) => {
  let html = '';
  data.forEach(doc => {
    const guide = doc.data();
    const li = `
    <li>
      <div class="collapsible-header grey lighten-4">${guide.title}</div>
      <div class="collapsible-body white"><span>${guide.content}</span></div>
    </li>
    `
    html+=li;
  });
  guideList.innerHTML = html;
};

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});