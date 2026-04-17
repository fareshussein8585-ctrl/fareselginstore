// بيانات الفايربيس (تم التأكد منها)
const firebaseConfig = {
    apiKey: "AIzaSyDBzygjra61hqPVhW1qTjlFv0mCtXkLzyc",
    databaseURL: "https://elgen-app-default-rtdb.firebaseio.com",
    projectId: "elgen-app",
    storageBucket: "elgen-app.firebasestorage.app",
    messagingSenderId: "1089000216997",
    appId: "1:1089000216997:android:4b8ba783ec7a0446e2304c"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.database();
let allAppsData = {}; 

function syncStore() {
    const container = document.getElementById('app-container');
    
    db.ref('apps').on('value', (snapshot) => {
        allAppsData = snapshot.val() || {}; 
        renderApps(allAppsData); 
    }, (error) => {
        container.innerHTML = `<p style="color:red">خطأ في الاتصال: تأكد من الـ Rules في فايربيس</p>`;
    });
}

function renderApps(data) {
    const container = document.getElementById('app-container');
    container.innerHTML = ''; 

    const keys = Object.keys(data);
    if (keys.length > 0) {
        keys.forEach(id => {
            const app = data[id];
            container.innerHTML += `
                <div class="app-card">
                    <img src="${app.icon || 'https://via.placeholder.com/100'}" alt="icon">
                    <h3>${app.name || 'تطبيق جديد'}</h3>
                    <div style="color:#f4b400; font-size:12px; margin-bottom:10px;">★★★★★</div>
                    <a href="${app.downloadUrl}" target="_blank" class="download-btn">تنزيل الآن</a>
                </div>
            `;
        });
    } else {
        container.innerHTML = '<p style="text-align:center; grid-column:1/-1; opacity:0.5;">مفيش تطبيقات لسة يا فارس!</p>';
    }
}

// برمجة البحث الحقيقي
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredApps = {};

    Object.keys(allAppsData).forEach(id => {
        const appName = allAppsData[id].name.toLowerCase();
        if (appName.includes(searchTerm)) {
            filteredApps[id] = allAppsData[id];
        }
    });
    renderApps(filteredApps);
});

window.onload = syncStore;
