const axios = require('axios');

async function checkHeaders() {
    try {
        console.log('Checking headers for Newest/List endpoint...');
        // Note: axios request might fail if run in environment without internet or proxy issues, but assuming it works as previous tests did.
        const res = await axios.get('https://api.komiku.org/manga/?orderby=date&tipe=manga');
        console.log('Status:', res.status);
        console.log('Headers:', res.headers);
        
        console.log('\nChecking headers for Search endpoint...');
        const resSearch = await axios.get('https://api.komiku.org/?post_type=manga&s=one%20piece');
        console.log('Status:', resSearch.status);
        console.log('Headers:', resSearch.headers);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkHeaders();
