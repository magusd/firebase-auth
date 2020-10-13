//grant admin cloud functions
const adminForm = document.querySelector('#admin-form');
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');

    addAdminRole({email: adminEmail}).then( result => {
        console.log(result);
    });
});


//listen for status changes

auth.onAuthStateChanged( user => {
    console.log('auth status');
    if(user){
        //data
        user.getIdTokenResult().then(idTokenResult => {
            console.log('claims');
            user.admin = idTokenResult.claims.admin;
            setupUI(user);
        });
        db.collection('guides').onSnapshot( snapshot => {
            setupGuides(snapshot.docs); 
        }, error => {
            console.log('ops');
        });
    }else{
        setupGuides([]); 
        setupUI(user);
    }
})

// create guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    db.collection('guides').add({
        title: createForm['title'].value,
        content: createForm['content'].value
    }).then(() => {
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset();
    });
});

// signup
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    const bio = signupForm['signup-bio'].value;
    
    auth.createUserWithEmailAndPassword(email, password).then( cred => {
        return db.collection('users').doc(cred.user.uid).set({
            bio: signupForm['signup-bio'].value
        });
    }).then( () =>{
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    }, error =>{
        signupForm.querySelector('.error').innerHTML = error.message;
    } );
});

//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});


//login form
const loginForm = document.querySelector('#login-form');

loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    
    auth.signInWithEmailAndPassword(email, password).then( cred => {
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    },  error =>{
        console.log(error);
        loginForm.querySelector('.error').innerHTML = error.message;
    } );
});