class Approx {
    constructor() {
        this.resultsSection = document.getElementById('results');
        this.solveButton = document.getElementById('solve');

        this.inputExpression = document.getElementById('input');
        this.inputDot = document.getElementById('localDot')

        this.solveButton.addEventListener('click', () => this.displayNewElem());
    }

    updateTex() {MathJax.typeset();}

    displayNewElem() {
        return undefined;
    }
}

class ChebyhevApprox extends Approx{
    constructor() {
        super();
        this.truncation = document.getElementById('truncation')
    }

    displayNewElem() {
        const container = document.createElement('div');
        container.classList.add('container', 'border', 'rounded', 'mb-3');

        const expression = this.inputExpression.value;
        const localDot = parseFloat(this.inputDot.value);
        const truncation = parseInt(this.truncation.value);

        //Аппрооксимация полиномами
        const polynomialSeries = document.createElement('div');
        polynomialSeries.classList.add('row');

        const newPolynomialSeries = document.createElement('div');
        newPolynomialSeries.classList.add('col');
        newPolynomialSeries.innerText = `${toSeries(expression, localDot, truncation).polySeries}`;

        const polynomials = document.createElement('div');
        polynomials.classList.add('row');

        const newPolynomials = document.createElement('div');
        newPolynomials.classList.add('col');
        newPolynomials.innerText = `${toSeries(expression, localDot, truncation).polys.join('')}`;

        //Аппроксимация степенным рядом
        const powerSeries = document.createElement('div');
        powerSeries.classList.add('row');

        const newPowerSeries = document.createElement('div');
        newPowerSeries.classList.add('col');
        newPowerSeries.innerText = `${toSeries(expression, localDot, truncation).powerSeries}`;

        //Ответ
        const result = document.createElement('div');
        result.classList.add('row');

        const newResult = document.createElement('div');
        newResult.classList.add('col');
        newResult.innerText = `${toSeries(expression, localDot, truncation).value}`

        //Отображене элементов
        polynomialSeries.appendChild(newPolynomialSeries)
        polynomials.appendChild(newPolynomials);
        powerSeries.appendChild(newPowerSeries);
        result.appendChild(newResult);

        container.appendChild(polynomialSeries);
        container.appendChild(polynomials);
        container.appendChild(powerSeries);
        container.appendChild(result)

        this.resultsSection.prepend(container);
        this.updateTex();
    }
}