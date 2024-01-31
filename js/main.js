const addBtn = document.getElementById('add-item');
const main = document.querySelector('main');
let pricesData = [];

addBtn.onclick = function() {
    const newItem = document.createElement('div');
    newItem.classList.add('item');
    newItem.innerHTML = `
        <div class="item-inner">
            <div class="item-input">
                <input oninput="onDataChange(this, 'quantity');" type="text">
                <p>единиц за</p>
                <input oninput="onDataChange(this, 'price');" type="text">
                <p>деняк</p>
            </div>
            <div class="item-output">
                <p>Заполните все поля</p>
            </div>
        </div>
        <button onclick="deleteItem(this);" class="delete-btn">
            <img src="img/delete.svg" alt="x">
        </button>
    `;
    main.insertBefore(newItem, addBtn);
    pricesData.push({
        element: newItem,
        quantity: undefined,
        price: undefined,
        unitPrice: undefined
    });
}

function onDataChange(target, type) {
    let index = getItemIndex(target.parentElement.parentElement.parentElement);
    pricesData[index][type] = target.value;
    // Обновление текущей изменённой карточки цены
    updateOutput(index);
    // Следом обновление всех карточек для перерасчёта разниц и лучшей цены
    updateAllOutputs();
}

function updateOutput(index) {
    // Расчет цены за единицу
    let unitPrice = pricesData[index].price / pricesData[index].quantity;
    if (unitPrice) {
        unitPrice = unitPrice.toFixed(2);
        // Запись расчётов
        pricesData[index]['unitPrice'] = unitPrice;
        // Обновление цены в карточке
        let itemOutput = pricesData[index]['element'].querySelector('.item-output p');
        itemOutput.innerHTML = `${unitPrice} деняк/единицу`;
        let bestPrice = findBestPrice();
        if (bestPrice === unitPrice) {
            itemOutput.innerHTML += ' - лучшая цена';
        }
        else {
            itemOutput.innerHTML += ` - дороже на ${priceCompare(unitPrice, bestPrice)}%`;
        }
    }
}

function updateAllOutputs() {
    for (let i in pricesData) {
        updateOutput(i);
    }
}

function priceCompare(toCompare, best) {
    return ((toCompare - best) / best * 100).toFixed(2);
}

function getItemIndex(target) {
    let items = main.querySelectorAll('.item');
    return Array.from(items).indexOf(target);
}

function deleteItem(target) {
    let index = getItemIndex(target.parentElement);
    target.parentElement.remove();
    // Данные в pricesData хранятся по индексам, которые совпадают в индексами карточек в main
    pricesData.splice(index, 1);
}



function findBestPrice() {
    // Лучшая цена не нужна для одной карточки
    if (pricesData.length <= 1) return false;
    let bestPrice = Infinity;
    for (let i in pricesData) {
        if (pricesData[i].unitPrice < bestPrice) {
            bestPrice = pricesData[i].unitPrice;
        }
    }
    return bestPrice;
}

window.onload = function() {
    addBtn.click();
    addBtn.click();
}