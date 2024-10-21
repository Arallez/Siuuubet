document.addEventListener('DOMContentLoaded', function () {
    let balance = 1000;
    const balanceDisplay = document.getElementById('balance');
    const betForm = document.getElementById('betForm');
    const betslip = document.getElementById('betslip');
    const betAmountInput = document.getElementById('betAmount');
    const betChoice = document.getElementById('betChoice');
    const potentialWinningsDisplay = document.getElementById('potentialWinnings');

    // Function to show league events
    window.showLeague = function (league) {
        const premierLeagueSection = document.getElementById('premier-league');
        const otherLeaguesSection = document.getElementById('other-leagues');

        if (league === 'premier') {
            premierLeagueSection.classList.remove('d-none');
            otherLeaguesSection.classList.add('d-none');
        } else {
            premierLeagueSection.classList.add('d-none');
            otherLeaguesSection.classList.remove('d-none');
        }
    };

    // Calculate potential winnings
    betAmountInput.addEventListener('input', function () {
        const odds = Array.from(betChoice.selectedOptions).map(option => parseFloat(option.getAttribute('data-odds')));
        const betAmount = parseFloat(betAmountInput.value);

        if (!isNaN(betAmount)) {
            const potentialWinnings = odds.map(odd => (betAmount * odd).toFixed(2));
            potentialWinningsDisplay.textContent = potentialWinnings.join(', ');
        } else {
            potentialWinningsDisplay.textContent = '0';
        }
    });

    // Handle bet submission
    betForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const selectedOption = betChoice.options[betChoice.selectedIndex];
        const outcome = selectedOption.text;
        const odds = parseFloat(selectedOption.getAttribute('data-odds'));
        const betAmount = parseFloat(betAmountInput.value);

        if (balance >= betAmount && odds > 0) {
            // Add bet to betslip
            const winnings = (betAmount * odds).toFixed(2);
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = `Bet: ${outcome} | Bet Amount: $${betAmount} | Potential Winnings: $${winnings}`;
            betslip.appendChild(listItem);

            // Deduct from balance
            balance -= betAmount;
            balanceDisplay.textContent = balance;

            // Clear form
            betAmountInput.value = '';
            potentialWinningsDisplay.textContent = '0';
        } else {
            alert('Insufficient balance or invalid odds');
        }
    });

    // Open bet modal with correct odds
    document.querySelectorAll('.bet-btn').forEach(button => {
        button.addEventListener('click', function () {
            const oddsElements = this.parentElement.querySelectorAll('.odds');
            const oddsArray = Array.from(oddsElements).map(odd => {
                return { outcome: odd.parentElement.textContent, odds: odd.dataset.odds };
            });

            // Clear previous options
            betChoice.innerHTML = '';

            // Add options with correct odds
            oddsArray.forEach(odd => {
                const option = document.createElement('option');
                option.value = odd.outcome;
                option.setAttribute('data-odds', odd.odds);
                option.textContent = `${odd.outcome} (Odds: ${odd.odds})`;
                betChoice.appendChild(option);
            });
        });
    });

    // Show the initial league
    showLeague('premier');
});
