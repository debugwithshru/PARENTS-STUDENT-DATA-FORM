# Prior Academic Record Section (Template)

This section was removed from the main New Student Enrollment form to be handled separately.

## HTML Code Reference

```html
<!-- Section 5: Prior Academic Record -->
<section>
    <h3 class="section-title">Prior Academic Record</h3>
    <div class="grid-row">
        <div class="input-group">
            <label for="prior_school">Prior School Name</label>
            <select id="prior_school" name="prior_school">
                <option value="" disabled selected>Select School</option>
                <option value="DAV">DAV</option>
                <option value="NHP">NHP</option>
                <option value="DMWA">DMWA</option>
                <option value="NHS">NHS</option>
            </select>
        </div>
        <div class="input-group">
            <label for="prior_exam">Exam Name</label>
            <input type="text" id="prior_exam" name="prior_exam" placeholder="e.g. Final Semester 2024">
        </div>
    </div>

    <div class="marks-container">
        <p class="section-subtitle">Prior Year Marks (Obtained / Max)</p>
        <div class="marks-table">
            <div class="marks-header">Subject</div>
            <div class="marks-header">Obtained</div>
            <div class="marks-header">Max</div>

            <div class="subject-label">Maths</div>
            <input type="number" name="prior_maths_ob" placeholder="0">
            <input type="number" name="prior_maths_max" placeholder="100">

            <div class="subject-label">Science</div>
            <input type="number" name="prior_science_ob" placeholder="0">
            <input type="number" name="prior_science_max" placeholder="100">

            <div class="subject-label">English</div>
            <input type="number" name="prior_english_ob" placeholder="0">
            <input type="number" name="prior_english_max" placeholder="100">

            <div class="subject-label">Social Science</div>
            <input type="number" name="prior_socsci_ob" placeholder="0">
            <input type="number" name="prior_socsci_max" placeholder="100">

            <div class="subject-label">2nd Language</div>
            <input type="number" name="prior_lang2_ob" placeholder="0">
            <input type="number" name="prior_lang2_max" placeholder="100">
        </div>
    </div>
</section>
```

## Field Names for Tracking
- `prior_school`
- `prior_exam`
- `prior_maths_ob`, `prior_maths_max`
- `prior_science_ob`, `prior_science_max`
- `prior_english_ob`, `prior_english_max`
- `prior_socsci_ob`, `prior_socsci_max`
- `prior_lang2_ob`, `prior_lang2_max`
