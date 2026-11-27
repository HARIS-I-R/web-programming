// MKS Used Cars - shared behaviour for all pages
document.addEventListener('DOMContentLoaded', function () {

    // Footer year
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    // Light / dark theme, remembered between visits
    if (localStorage.getItem('mks-theme') === 'light') document.body.classList.add('light');
    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            document.body.classList.toggle('light');
            localStorage.setItem('mks-theme', document.body.classList.contains('light') ? 'light' : 'dark');
        });
    }

    // Mobile menu
    var menuBtn = document.getElementById('menuBtn');
    var navlinks = document.getElementById('navlinks');
    if (menuBtn && navlinks) {
        menuBtn.addEventListener('click', function () { navlinks.classList.toggle('open'); });
    }

    // Inventory search and brand filter
    var search = document.getElementById('searchCars');
    var filter = document.getElementById('carFilter');
    var emptyState = document.getElementById('emptyState');
    if (search && filter && emptyState) {
        var cards = Array.prototype.slice.call(document.querySelectorAll('#carList .card'));
        var applyFilters = function () {
            var q = search.value.trim().toLowerCase();
            var brand = filter.value;
            var visible = 0;
            cards.forEach(function (card) {
                var show = card.dataset.name.indexOf(q) !== -1 && (brand === 'all' || card.dataset.brand === brand);
                card.style.display = show ? '' : 'none';
                if (show) visible++;
            });
            emptyState.style.display = visible ? 'none' : 'block';
        };
        search.addEventListener('input', applyFilters);
        filter.addEventListener('change', applyFilters);
    }

    // Contact form: prefill from "Enquire" links, validate, then open an email to the dealer
    var form = document.getElementById('enquiryForm');
    if (form) {
        var params = new URLSearchParams(window.location.search);
        var vehicle = params.get('vehicle');
        if (vehicle) document.getElementById('enqVehicle').value = vehicle;

        var successBox = document.getElementById('enquirySuccess');
        var errorBox = document.getElementById('formErrors');
        var errorList = document.getElementById('errorList');

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var name = document.getElementById('enqName').value.trim();
            var phone = document.getElementById('enqPhone').value.trim();
            var email = document.getElementById('enqEmail').value.trim();
            var vehicleValue = document.getElementById('enqVehicle').value;
            var message = document.getElementById('enqMessage').value.trim();
            var errors = [];

            if (name === '') errors.push('Please enter your name.');
            if (!/^(?:\+91|91|0)?[6-9]\d{9}$/.test(phone)) errors.push('Enter a valid 10-digit Indian mobile number.');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push('Enter a valid email address.');
            if (vehicleValue === '') errors.push('Please choose a vehicle.');
            if (message.length > 1000) errors.push('Your message must be 1000 characters or fewer.');

            successBox.hidden = true;
            errorList.innerHTML = '';
            if (errors.length) {
                errors.forEach(function (text) {
                    var li = document.createElement('li');
                    li.textContent = text;
                    errorList.appendChild(li);
                });
                errorBox.hidden = false;
                errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            errorBox.hidden = true;
            var subject = 'Enquiry about ' + vehicleValue;
            var body = 'Name: ' + name + '\nPhone: ' + phone + '\nEmail: ' + email +
                       '\nVehicle: ' + vehicleValue + '\n\nMessage:\n' + message;
            window.location.href = 'mailto:mksusedcars@gmail.com?subject=' +
                encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
            successBox.hidden = false;
        });
    }
});
