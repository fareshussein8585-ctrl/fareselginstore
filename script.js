// بيانات الفايربيس (تم التأكد منها)
const firebaseConfig = {
    apiKey: "AIzaSyDBzygjra61hqPVhW1qTjlFv0mCtXkLzyc",
    databaseURL: "https://elgen-app-default-rtdb.firebaseio.com",
    projectId: "elgen-app",
    storageBucket: "elgen-app.firebasestorage.app",
    messagingSenderId: "1089000216997",
    appId: "1:1089000216997:android:4b8ba783ec7a0446e2304c"
};

// تهيئة تطبيق فايربيز إذا لم يكن مهيئاً مسبقاً
if (!firebase.apps.length) { 
    firebase.initializeApp(firebaseConfig); 
}

const db = firebase.database();
let allAppsData = {}; 

// دالة جلب البيانات ومزامنتها مع الفايربيس
function syncStore() {
    const container = document.getElementById('app-container');
    
    db.ref('apps').on('value', (snapshot) => {
        allAppsData = snapshot.val() || {}; 
        renderApps(allAppsData); 
    }, (error) => {
        container.innerHTML = `<p style="color:red">خطأ في الاتصال: تأكد من الـ Rules في فايربيس</p>`;
    });
}

// دالة عرض وتنسيق الكروت على الشاشة
function renderApps(data) {
    const container = document.getElementById('app-container');
    container.innerHTML = ''; 

    const keys = Object.keys(data);
    if (keys.length > 0) {
        keys.forEach(id => {
            const app = data[id];
            
            // 1. حساب نظام التقييم بالنجوم برمجياً (الافتراضي 0 إذا لم يوجد في الفايربيز)
            const rating = app.rating ? parseInt(app.rating) : 0; 
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                // نجمة صفراء منورة (#FFD700) أو رمادية مطفية (#ccc) بناءً على التقييم
                starsHtml += `<span style="color: ${i <= rating ? '#FFD700' : '#ccc'}; font-size: 16px;">★</span>`;
            }

            // 2. بناء الهيكل وعرض البيانات ديناميكياً
            container.innerHTML += `
                <div class="app-card">
                    <img src="${app.icon || 'https://via.placeholder.com/100'}" alt="icon">
                    <h3>${app.name || 'تطبيق جديد'}</h3>
                    <div style="margin-bottom:10px; user-select: none;">
                        ${starsHtml}
                    </div>
                    <a href="${app.downloadUrl}" target="_blank" class="download-btn">تنزيل الآن</a>
                </div>
            `;
        });
    } else {
        container.innerHTML = '<p style="text-align:center; grid-column:1/-1; opacity:0.5;">مفيش تطبيقات لسة يا فارس!</p>';
    }
}

// برمجة شريط البحث لتصفية التطبيقات بدقة
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredApps = {};

    Object.keys(allAppsData).forEach(id => {
        if (allAppsData[id] && allAppsData[id].name) {
            const appName = allAppsData[id].name.toLowerCase();
            if (appName.includes(searchTerm)) {
                filteredApps[id] = allAppsData[id];
            }
        }
    });
    renderApps(filteredApps);
});

// تشغيل المزامنة فور اكتمال تحميل الصفحة
window.onload = syncStore;
