document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('enrollmentForm');
    const enrollmentDateInput = document.getElementById('enrollment_date');
    const schoolNameSelect = document.getElementById('school_name');
    const priorSchoolNameSelect = document.getElementById('prior_school_name');

    // School Name Synchronization
    schoolNameSelect.addEventListener('change', () => {
        priorSchoolNameSelect.value = schoolNameSelect.value;
    });

    // Toggle "Other" Language logic
    window.toggleOtherLanguage = (selectElement, otherInputId) => {
        const otherInput = document.getElementById(otherInputId);
        if (selectElement.value === 'Other') {
            otherInput.style.display = 'block';
            otherInput.required = true;
        } else {
            otherInput.style.display = 'none';
            otherInput.required = false;
        }
    };

    // Helper: Capitalize first letter of each word
    const formatName = (str) => {
        if (!str) return '';
        return str.trim().split(/\s+/).map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    // Helper: Validate Full Name (at least 2 words)
    const isValidFullName = (str) => {
        if (!str) return false;
        return str.trim().split(/\s+/).length >= 2;
    };

    // Helper: Validate 10-digit phone number
    const isValidPhone = (str) => {
        return /^\d{10}$/.test(str.trim());
    };

    // Webhook Configuration
    const WEBHOOK_URL = 'https://n8n.srv1498466.hstgr.cloud/webhook/31944e96-cde5-443e-91a5-8f8a52ac70c6'; 

    // Version Check
    console.log('Student Data Form Script V3.0 - POST / Validation / Capitalization');

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form Submit Triggered');
        
        try {
            const formData = new FormData(form);

            // Helper to get radio/check value
            const getVal = (name) => formData.get(name);
            const getRadio = (name) => {
                const el = form.querySelector(`input[name="${name}"]:checked`);
                return el ? el.value : null;
            };

            // 1. Basic Info & Formatting
            const first_name = formatName(getVal('first_name'));
            const last_name = formatName(getVal('last_name'));
            const gender = getRadio('gender');
            const dobRaw = getVal('dob');
            const grade = getRadio('grade');
            const branch = getRadio('branch');
            const school_name = getVal('school_name');
            const prior_school_name = getVal('prior_school_name');
            const address = getVal('address');

            // Format DOB to dd-mm-yyyy
            let dob = '';
            if (dobRaw) {
                const [y, m, d] = dobRaw.split('-');
                dob = `${d}-${m}-${y}`;
            }

            // Hobbies logic
            const hobbies_val = getVal('hobbies');
            const hobbies = hobbies_val === 'Other' ? getVal('hobbies_other') : hobbies_val;
            
            // Subjects
            const selectedSubjects = Array.from(form.querySelectorAll('input[name="subjects"]:checked'))
                .map(cb => cb.value);
            
            if (selectedSubjects.length < 5) {
                alert('Rule: Minimum 5 subjects must be selected.');
                const grid = document.querySelector('.checkbox-grid');
                if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // 2. Primary Contact Validation & Formatting
            let primary_name = getVal('primary_name');
            if (!isValidFullName(primary_name)) {
                alert('Please enter FULL NAME for Primary Contact (Name and Surname).');
                document.getElementById('primary_name').focus();
                return;
            }
            primary_name = formatName(primary_name);

            const primary_number = getVal('primary_number');
            if (!isValidPhone(primary_number)) {
                alert('Primary Contact Number must be a valid 10-digit number.');
                document.getElementById('primary_number').focus();
                return;
            }

            const primary_relation = getRadio('primary_relation');
            const primary_language = getVal('primary_language') === 'Other' ? getVal('primary_language_other') : getVal('primary_language');

            // 3. Secondary Contact Validation & Formatting
            let secondary_name = getVal('secondary_name');
            if (!isValidFullName(secondary_name)) {
                alert('Please enter FULL NAME for Secondary Contact (Name and Surname).');
                document.getElementById('secondary_name').focus();
                return;
            }
            secondary_name = formatName(secondary_name);

            const secondary_number = getVal('secondary_number');
            if (!isValidPhone(secondary_number)) {
                alert('Secondary Contact Number must be a valid 10-digit number.');
                document.getElementById('secondary_number').focus();
                return;
            }

            const secondary_relation = getRadio('secondary_relation');
            const secondary_language = getVal('secondary_language') === 'Other' ? getVal('secondary_language_other') : getVal('secondary_language');

            // 4. Enrollment Details
            const enrollment_status = getRadio('enrollment_status');
            const enrollment_date_raw = getVal('enrollment_date');
            let enrollment_date = '';
            if (enrollment_date_raw) {
                const [y, m, d] = enrollment_date_raw.split('-');
                enrollment_date = `${d}-${m}-${y}`;
            }
            const combo_package = getRadio('combo_package');

            // Build Payload for n8n (POST JSON)
            const payload = {
                first_name,
                last_name,
                gender,
                dob,
                hobbies: hobbies || '',
                grade,
                branch,
                school_name,
                prior_school_name,
                address,
                subjects_opted: selectedSubjects.join(', '),
                primary_contact_name: primary_name,
                primary_contact_phone: primary_number,
                primary_contact_relation: primary_relation,
                primary_language,
                secondary_contact_name: secondary_name,
                secondary_contact_phone: secondary_number,
                secondary_contact_relation: secondary_relation,
                secondary_language,
                enrollment_status,
                enrollment_date,
                combo_package,
                submission_date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
            };

            console.log('Submitting Payload:', payload);

            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok || response.status === 0) { // status 0 for no-cors situations if needed, but here we expect POST to work
                console.log('Successfully submitted');
                
                // Show 'FORM SUBMITTED' Overlay
                const successOverlay = document.getElementById('successOverlay');
                successOverlay.classList.add('active');

                // Success feedback on button
                const btn = document.getElementById('submitBtn');
                btn.textContent = 'Redirecting...';
                btn.style.background = '#00b894';

                // Automatically Redirect after 3.5 seconds
                setTimeout(() => {
                    const feeUrl = `https://student-fee-management.vercel.app/index.html?STUDENT_NAME=${first_name}%20${last_name}&GRADE=${grade}&BRANCH=${branch}`;
                    window.location.href = feeUrl;
                }, 3500); 
            } else {
                throw new Error('Server responded with ' + response.status);
            }

        } catch (err) {
            console.error('Submission Error:', err);
            alert('Error submitting form. Please try again or check your internet connection.');
        }
    });
});
