<script lang="ts">
    import './app.css';
    import Fa from 'svelte-fa';
    import { faTrash, faPlus, faEraser, faPlay, fa1 } from '@fortawesome/free-solid-svg-icons';
    import { onMount } from 'svelte';
    import { moneyFormat, cleanNumber } from './service/MoneyHelper';

    interface Unit {
        full: string;
        small: string;
        ratio: number;
    }

    const units: Record<string, Unit> = {
        кг: {
            full: 'кг',
            small: 'г',
            ratio: 1000,
        },
        л: {
            full: 'л',
            small: 'мл',
            ratio: 1000,
        },
        ед: {
            full: 'ед',
            small: 'ед',
            ratio: 1,
        },
    };

    let selectedUnit: Unit = $state(units['кг']);

    const maxNumber: number = 2147483647;

    interface CalculatedItem {
        price: string;
        amount: string;
        total: number;
        diff: number;
        winner: boolean;
    }

    let calculatedItems: CalculatedItem[] = $state([
        { price: '', amount: '', total: 0, diff: 0, winner: false },
        { price: '', amount: '', total: 0, diff: 0, winner: false },
    ]);

    onMount(() => {
        calculate();
    });

    function handleUnitChange(e: Event): void {
        const target = e.target as HTMLSelectElement;
        selectedUnit = units[target.value];
        calculate();
    }

    function handleAddItem(): void {
        calculatedItems.push({
            price: '',
            amount: '',
            total: 0,
            diff: 0,
            winner: false,
        });
    }

    function handleDeleteItem(idx: number): void {
        if (idx > 1) {
            calculatedItems.splice(idx, 1);
            calculate();
        }
    }

    function handleClear(): void {
        calculatedItems = [
            { price: '', amount: '', total: 0, diff: 0, winner: false },
            { price: '', amount: '', total: 0, diff: 0, winner: false },
        ];
        calculate();
    }

    function calculate(): void {
        let minValue: number = maxNumber;

        calculatedItems.forEach((value: CalculatedItem, key: number, map: CalculatedItem[]) => {
            const price: number = cleanNumber(value.price);
            const amount: number = cleanNumber(value.amount);

            let total: number = 0;
            if (price > 0 && amount > 0) {
                total = (selectedUnit.ratio / amount) * price;
                total = parseFloat(total.toFixed(2));
            }

            map[key].total = total;
            map[key].diff = 0;
            map[key].winner = false;

            if (total !== 0 && total < minValue) {
                minValue = total;
            }
        });

        calculatedItems.forEach((value: CalculatedItem, key: number, map: CalculatedItem[]) => {
            if (value.total === minValue) {
                map[key].diff = 0;
                map[key].winner = true;
                return;
            }

            if (value.total > 0) {
                map[key].diff = value.total - minValue;
            }
        });
    }
</script>

<header>
    <div class="container border-warning">
        <h2 class="my-4 d-flex align-items-center">
            <strong class="me-3">Выгодно</strong>
            <select onchange={handleUnitChange} class="form-select form-select-lg unit-selector">
                <option value="кг" selected>за килограмм</option>
                <option value="л">за литр</option>
                <option value="ед">за единицу</option>
            </select>
        </h2>
    </div>
</header>

<main class="py-3">
    <div class="container">
        {#each calculatedItems as item, i (i)}
            <div class="mb-3">
                <div class="p-2 text-end">
                    {#if item.winner}
                        <span class="winner">ВЫГОДНО!</span>
                    {:else if item.diff > 0}
                        <span class="text-danger">
                            +{moneyFormat(item.diff)} ₽/{selectedUnit.full}
                        </span>
                    {/if}
                    <strong>{moneyFormat(item.total)} ₽/{selectedUnit.full}</strong>
                </div>
                <div class="input-group">
                    <span class="input-group-text">Товар {i + 1}</span>
                    <input type="number" bind:value={item.amount} placeholder="0" class="form-control text-end" />
                    <span class="input-group-text">{selectedUnit.small}</span>
                    <input type="number" bind:value={item.price} placeholder="0" class="form-control text-end" />
                    <span class="input-group-text">₽</span>
                    <span class="input-group-text">
                        {#if i + 1 > 2}
                            <button
                                type="button"
                                onclick={() => handleDeleteItem(i)}
                                class="btn btn-sm btn-link text-danger"
                            >
                                <Fa fw icon={faTrash} />
                            </button>
                        {:else}
                            <button type="button" class="btn btn-sm btn-link disabled">
                                <Fa fw icon={faTrash} />
                            </button>
                        {/if}
                    </span>
                </div>
            </div>
        {/each}

        <div class="d-flex gap-2">
            <button type="button" onclick={handleClear} class="btn btn-warning">
                <Fa icon={faEraser} />
            </button>
            <button type="button" onclick={calculate} class="btn btn-primary flex-grow-1">
                <Fa icon={faPlay} />
                Рассчитать
            </button>
            <button type="button" onclick={handleAddItem} class="btn btn-warning">
                <Fa icon={faPlus} />
                <Fa icon={fa1} />
                Товар
            </button>
        </div>
    </div>
</main>

<footer>
    <div class="container border-warning">
        <div class="row">
            <div class="col text-md-end">&copy; DimNS v1.1.0</div>
        </div>
    </div>
</footer>

<style>
    header .container {
        border-bottom-width: 4px;
        border-bottom-style: solid;
    }

    footer .container {
        border-top-width: 2px;
        border-top-style: solid;
        font-size: 0.9em;
    }

    .container {
        max-width: 960px;
    }
</style>
