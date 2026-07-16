import { SortingVisualizerComponent } from '../components/sorting-visualizer/sorting-visualizer.component';
import { SortBarInterface } from '../shared/models/sort-bar/sort-bar.constants';
export * from './common';
import { leftPivotQuickSort, middlePivotQuickSort, medianPivotQuickSort } from './quick-sort';
import { mergeSort } from './merge-sort';
import { timSort } from './tim-sort';
import { selectionSort, doubleSelectionSort } from './selection-sort';
import { heapSort } from './heap-sort';
import { tournamentSort } from './tournament-sort';
import { cycleSort } from './cycle-sort';
import { insertionSort } from './insertion-sort';
import { shellSort, frankLazarusShellSort, hibbardShellSort, papernovStasevichShellSort, tokudaShellSort, ciuraShellSort } from './shell-sort';
import { treeSort } from './tree-sort';
import { bubbleSort } from './bubble-sort';
import { gnomeSort } from './gnome-sort';
import { cocktailShakerSort, boundedCocktailShakerSort } from './cocktail-shaker-sort';
import { exchangeSort } from './exchange-sort';
import { oddEvenSort } from './odd-even-sort';
import { combSort } from './comb-sort';
import { pigeonholeSort } from './pigeonhole-sort';
import { uniformKeysBucketSort } from './uniform-keys-bucket-sort';
import { integerKeysBucketSort } from './integer-keys-bucket-sort';
import { countingSort } from './counting-sort';
import { lsdRadixSort } from './lsd-radix-sort';
import { msdRadixSort } from './msd-radix-sort';
import { beadSort } from './bead-sort';
import { pancakeSort } from './pancake-sort';
import { spaghettiSort } from './spaghetti-sort';
import { bitonicSort } from './bitonic-sort';
import { stoogeSort } from './stooge-sort';
import { slowSort } from './slow-sort';
import { bogoSort } from './bogo-sort';
import { purgeSort } from './purgesort';
import { thanosSort } from './thanos-sort';

export const ALGORITHMS: Map<string, (visualizer: SortingVisualizerComponent, array: SortBarInterface[]) => Promise<void>> = new Map([
  ['leftPivotQuickSort', leftPivotQuickSort], ['middlePivotQuickSort', middlePivotQuickSort], ['medianPivotQuickSort', medianPivotQuickSort],
  ['mergeSort', mergeSort],
  ['timSort', timSort],
  ['selectionSort', selectionSort], ['doubleSelectionSort', doubleSelectionSort],
  ['heapSort', heapSort], ['tournamentSort', tournamentSort],
  ['cycleSort', cycleSort],
  ['insertionSort', insertionSort],
  ['shellSort', shellSort], ['frankLazarusShellSort', frankLazarusShellSort], ['hibbardShellSort', hibbardShellSort], ['papernovStasevichShellSort', papernovStasevichShellSort], ['tokudaShellSort', tokudaShellSort], ['ciuraShellSort', ciuraShellSort],
  ['treeSort', treeSort],
  ['bubbleSort', bubbleSort],
  ['gnomeSort', gnomeSort],
  ['cocktailShakerSort', cocktailShakerSort], ['boundedCocktailShakerSort', boundedCocktailShakerSort],
  ['exchangeSort', exchangeSort],
  ['oddEvenSort', oddEvenSort],
  ['combSort', combSort],
  ['pigeonholeSort', pigeonholeSort],
  ['uniformKeysBucketSort', uniformKeysBucketSort], ['integerKeysBucketSort', integerKeysBucketSort],
  ['countingSort', countingSort],
  ['lsdRadixSort', lsdRadixSort], ['msdRadixSort', msdRadixSort],
  ['beadSort', beadSort],
  ['pancakeSort', pancakeSort],
  ['spaghettiSort', spaghettiSort],
  ['bitonicSort', bitonicSort],
  ['stoogeSort', stoogeSort],
  ['slowSort', slowSort],
  ['bogoSort', bogoSort],
  ['purgeSort', purgeSort],
  ['thanosSort', thanosSort]
]);

export const ALGORITHMS_INFO = [
  {
    "category": "Partitioning",
    "algorithms": [
      {
        "active": true,
        "label": "Left Pivot Quick Sort",
        "value": "Left Pivot Quick",
        "best": "nlogn",
        "average": "nlogn",
        "worst": "n^(2)",
        "memory": "logn",
        "labels": {
          "en": "Quicksort",
          "es": "Quicksort",
          "fr": "Tri_rapide",
          "id": "Quicksort",
          "zh": "快速排序"
        }
      },
      {
        "active": true,
        "label": "Middle Pivot Quick Sort",
        "value": "Middle Pivot Quick",
        "best": "nlogn",
        "average": "nlogn",
        "worst": "n^(2)",
        "memory": "logn",
        "labels": {
          "en": "Quicksort",
          "es": "Quicksort",
          "fr": "Tri_rapide",
          "id": "Quicksort",
          "zh": "快速排序"
        }
      },
      {
        "active": true,
        "label": "Median Pivot Quick Sort",
        "value": "Median Pivot Quick",
        "best": "nlogn",
        "average": "nlogn",
        "worst": "n^(2)",
        "memory": "logn",
        "labels": {
          "en": "Quicksort",
          "es": "Quicksort",
          "fr": "Tri_rapide",
          "id": "Quicksort",
          "zh": "快速排序"
        }
      }
    ]
  },
  {
    "category": "Merging",
    "algorithms": [
      {
        "active": true,
        "label": "Merge Sort",
        "value": "Merge",
        "best": "nlogn",
        "average": "nlogn",
        "worst": "nlogn",
        "memory": "n",
        "labels": {
          "en": "Merge_sort",
          "es": "Ordenamiento_por_mezcla",
          "fr": "Tri_fusion",
          "id": "Urut_gabung",
          "zh": "归并排序"
        }
      },
      {
        "active": true,
        "label": "Tim Sort",
        "value": "Tim",
        "best": "n",
        "average": "nlogn",
        "worst": "nlogn",
        "memory": "n",
        "labels": {
          "en": "Timsort",
          "es": undefined,
          "fr": "Timsort",
          "id": undefined,
          "zh": "Timsort"
        }
      }
    ]
  },
  {
    "category": "Selection",
    "algorithms": [
      {
        "active": true,
        "label": "Selection Sort",
        "value": "Selection",
        "best": "n^(2)",
        "average": "n^(2)",
        "worst": "n^(2)",
        "memory": "1",
        "labels": {
          "en": "Selection_sort",
          "es": "Ordenamiento_por_selección",
          "fr": "Tri_par_sélection",
          "id": undefined,
          "zh": "选择排序"
        }
      },
      {
        "active": true,
        "label": "Double Selection Sort",
        "value": "Double Selection",
        "best": "n^(2)",
        "average": "n^(2)",
        "worst": "n^(2)",
        "memory": "1",
        "labels": {
          "en": "Selection_sort",
          "es": "Ordenamiento_por_selección",
          "fr": "Tri_par_sélection",
          "id": undefined,
          "zh": "选择排序"
        }
      },
      {
        "active": true,
        "label": "Heap Sort",
        "value": "Heap",
        "best": "nlogn",
        "average": "nlogn",
        "worst": "nlogn",
        "memory": "1",
        "labels": {
          "en": "Heapsort",
          "es": "Heapsort",
          "fr": "Tri_par_tas",
          "id": undefined,
          "zh": "堆排序"
        }
      },
      {
        "active": true,
        "label": "Tournament Sort",
        "value": "Tournament",
        "best": "nlogn",
        "average": "nlogn",
        "worst": "nlogn",
        "memory": "n",
        "labels": {
          "en": "Tournament_sort",
          "es": undefined,
          "fr": undefined,
          "id": undefined,
          "zh": "锦标赛排序"
        }
      },
      {
        "active": true,
        "label": "Cycle Sort",
        "value": "Cycle",
        "best": "n^(2)",
        "average": "n^(2)",
        "worst": "n^(2)",
        "memory": "1",
        "stats": [
          {
            "label": "WRITES",
            "type": "string",
            "value": "0"
          }
        ],
        "labels": {
          "en": "Cycle_sort",
          "es": undefined,
          "fr": undefined,
          "id": undefined,
          "zh": undefined
        }
      }
    ]
  },
  {
    "category": "Insertion",
    "algorithms": [
      {
        "active": true,
        "label": "Insertion Sort",
        "value": "Insertion",
        "best": "n",
        "average": "n^(2)",
        "worst": "n^(2)",
        "memory": "1",
        "labels": {
          "en": "Insertion_sort",
          "es": "Ordenamiento_por_inserción",
          "fr": "Tri_par_insertion",
          "id": undefined,
          "zh": "插入排序"
        }
      },
      {
        "active": true,
        "label": "Shell Sort",
        "value": "Shell",
        "best": "nlogn",
        "average": "n^(4/3)",
        "worst": "n^(3/2)",
        "memory": "1",
        "stats": [
          {
            "label": "GAPS",
            "type": "array",
            "value": []
          }
        ],
        "labels": {
          "en": "Shellsort",
          "es": "Ordenamiento_Shell",
          "fr": "Tri_de_Shell",
          "id": undefined,
          "zh": "希尔排序"
        }
      },
      {
        "active": true,
        "label": "Frank Lazarus Shell Sort",
        "value": "Frank Lazarus Shell",
        "best": "nlogn",
        "average": "n^(4/3)",
        "worst": "n^(3/2)",
        "memory": "1",
        "stats": [
          {
            "label": "GAPS",
            "type": "array",
            "value": []
          }
        ],
        "labels": {
          "en": "Shellsort",
          "es": "Ordenamiento_Shell",
          "fr": "Tri_de_Shell",
          "id": undefined,
          "zh": "希尔排序"
        }
      },
      {
        "active": true,
        "label": "Hibbard Shell Sort",
        "value": "Hibbard Shell",
        "best": "nlogn",
        "average": "n^(4/3)",
        "worst": "n^(3/2)",
        "memory": "1",
        "stats": [
          {
            "label": "GAPS",
            "type": "array",
            "value": []
          }
        ],
        "labels": {
          "en": "Shellsort",
          "es": "Ordenamiento_Shell",
          "fr": "Tri_de_Shell",
          "id": undefined,
          "zh": "希尔排序"
        }
      },
      {
        "active": true,
        "label": "Papernov Stasevich Shell Sort",
        "value": "Papernov Stasevich Shell",
        "best": "nlogn",
        "average": "n^(4/3)",
        "worst": "n^(3/2)",
        "memory": "1",
        "stats": [
          {
            "label": "GAPS",
            "type": "array",
            "value": []
          }
        ],
        "labels": {
          "en": "Shellsort",
          "es": "Ordenamiento_Shell",
          "fr": "Tri_de_Shell",
          "id": undefined,
          "zh": "希尔排序"
        }
      },
      {
        "active": true,
        "label": "Tokuda Shell Sort",
        "value": "Tokuda Shell",
        "best": "nlogn",
        "average": "n^(4/3)",
        "worst": "n^(3/2)",
        "memory": "1",
        "stats": [
          {
            "label": "GAPS",
            "type": "array",
            "value": []
          }
        ],
        "labels": {
          "en": "Shellsort",
          "es": "Ordenamiento_Shell",
          "fr": "Tri_de_Shell",
          "id": undefined,
          "zh": "希尔排序"
        }
      },
      {
        "active": true,
        "label": "Ciura Shell Sort",
        "value": "Ciura Shell",
        "best": "nlogn",
        "average": "n^(4/3)",
        "worst": "n^(3/2)",
        "memory": "1",
        "stats": [
          {
            "label": "GAPS",
            "type": "array",
            "value": []
          }
        ],
        "labels": {
          "en": "Shellsort",
          "es": "Ordenamiento_Shell",
          "fr": "Tri_de_Shell",
          "id": undefined,
          "zh": "希尔排序"
        }
      },
      {
        "active": true,
        "label": "Tree Sort",
        "value": "Tree",
        "best": "nlogn",
        "average": "nlogn",
        "worst": "nlogn",
        "memory": "n",
        "labels": {
          "en": "Tree_sort",
          "es": "Ordenamiento_con_árbol_binario",
          "fr": "Tri_arborescent",
          "id": undefined,
          "zh": undefined
        }
      }
    ]
  },
  {
    "category": "Exchanging",
    "algorithms": [
      {
        "active": true,
        "label": "Bubble Sort",
        "value": "Bubble",
        "best": "n",
        "average": "n^(2)",
        "worst": "n^(2)",
        "memory": "1",
        "labels": {
          "en": "Bubble_sort",
          "es": "Ordenamiento_de_burbuja",
          "fr": "Tri_à_bulles",
          "id": undefined,
          "zh": "冒泡排序"
        }
      },
      {
        "active": true,
        "label": "Gnome Sort", 
        "value": "Gnome",
        "best": "n",
        "average": "n^(2)",
        "worst": "n^(2)",
        "memory": "1",
        "labels": {
          "en": "Gnome_sort",
          "es": "Gnome_sort",
          "fr": undefined,
          "id": undefined,
          "zh": "侏儒排序"
        }
      },
      {
        "active": true,
        "label": "Cocktail Shaker Sort",
        "value": "Cocktail Shaker",
        "best": "n",
        "average": "n^(2)",
        "worst": "n^(2)",
        "memory": "1",
        "labels": {
          "en": "Cocktail_shaker_sort",
          "es": "Ordenamiento_de_burbuja_bidireccional",
          "fr": "Tri_cocktail",
          "id": undefined,
          "zh": "鸡尾酒排序"
        }
      },
      {
        "active": true,
        "label": "Bounded Cocktail Shaker Sort",
        "value": "Bounded Cocktail Shaker",
        "best": "n",
        "average": "n^(2)",
        "worst": "n^(2)",
        "memory": "1",
        "labels": {
          "en": "Cocktail_shaker_sort",
          "es": "Ordenamiento_de_burbuja_bidireccional",
          "fr": "Tri_cocktail",
          "id": undefined,
          "zh": "鸡尾酒排序"
        }
      },
      {
        "active": true,
        "label": "Exchange Sort",
        "value": "Exchange",
        "best": "n^(2)",
        "average": "n^(2)",
        "worst": "n^(2)",
        "memory": "1",
        "labels": {
          "en": "Sorting_algorithm",
          "es": "Algoritmo_de_ordenamiento",
          "fr": "Algorithme_de_tri",
          "id": "Algoritma_penyortiran",
          "zh": "排序算法"
        }
      },
      {
        "active": true,
        "label": "Odd-Even Sort",
        "value": "Odd-even",
        "best": "n",
        "average": "n^(2)",
        "worst": "n^(2)",
        "memory": "1",
        "labels": {
          "en": "Odd–even_sort",
          "es": "Ordenamiento_impar-par",
          "fr": "Tri_pair-impair",
          "id": undefined,
          "zh": "奇偶排序"
        }
      },
      {
        "active": true,
        "label": "Comb Sort",
        "value": "Comb",
        "best": "nlogn",
        "average": "n^(2)",
        "worst": "n^(2)",
        "memory": "1",
        "labels": {
          "en": "Comb_sort",
          "es": "Comb_sort",
          "fr": "Tri_à_peigne",
          "id": undefined,
          "zh": "梳排序"
        }
      }
    ]
  },
  {
    "category": "Non-Comparison",
    "algorithms": [
      {
        "active": true,
        "label": "Pigeonhole Sort",
        "value": "Pigeonhole",
        "best": "-",
        "average": "n + 2^(k)",
        "worst": "n + 2^(k)",
        "memory": "2^(k)",
        "labels": {
          "en": "Pigeonhole_sort",
          "es": undefined,
          "fr": undefined,
          "id": undefined,
          "zh": "鸽巢排序"
        }
      },
      {
        "active": true,
        "label": "Uniform Keys Bucket Sort",
        "value": "Uniform Keys Bucket",
        "best": "-",
        "average": "n + k",
        "worst": "n^(2) · k",
        "memory": "n · k",
        "labels": {
          "en": "Bucket_sort",
          "es": "Ordenamiento_por_casilleros",
          "fr": "Tri_par_paquets",
          "id": undefined,
          "zh": "桶排序"
        }
      },
      {
        "active": true,
        "label": "Integer Keys Bucket Sort",
        "value": "Integer Keys Bucket",
        "best": "-",
        "average": "n + r",
        "worst": "n + r",
        "memory": "n + r",
        "labels": {
          "en": "Bucket_sort",
          "es": "Ordenamiento_por_casilleros",
          "fr": "Tri_par_paquets",
          "id": undefined,
          "zh": "桶排序"
        }
      },
      {
        "active": true,
        "label": "Counting Sort",
        "value": "Counting",
        "best": "-",
        "average": "n + r",
        "worst": "n + r",
        "memory": "n + r",
        "labels": {
          "en": "Counting_sort",
          "es": "Ordenamiento_por_cuentas",
          "fr": "Tri_comptage",
          "id": undefined,
          "zh": "计数排序"
        }
      },
      {
        "active": true,
        "label": "LSD Radix Sort",
        "value": "LSD Radix",
        "best": "n",
        "average": "n · (k/d)",
        "worst": "n · (k/d)",
        "memory": "n + 2^(d)",
        "labels": {
          "en": "Radix_sort",
          "es": "Ordenamiento_Radix",
          "fr": "Tri_par_base",
          "id": undefined,
          "zh": "基数排序"
        }
      },
      {
        "active": true,
        "label": "MSD Radix Sort",
        "value": "MSD Radix",
        "best": "-",
        "average": "n · (k/d)",
        "worst": "n · (k/d)",
        "memory": "n + 2^(d)",
        "labels": {
          "en": "Radix_sort",
          "es": "Ordenamiento_Radix",
          "fr": "Tri_par_base",
          "id": undefined,
          "zh": "基数排序"
        }
      }
    ]
  },
  {
    "category": "Others",
    "algorithms": [
      {
        "active": true,
        "label": "Bead Sort",
        "value": "Bead",
        "best": "n",
        "average": "S",
        "worst": "S",
        "memory": "n^(2)",
        "labels": {
          "en": "Bead_sort",
          "es": undefined,
          "fr": undefined,
          "id": undefined,
          "zh": "珠排序"
        }
      },
      {
        "active": true,
        "label": "Pancake Sort",
        "value": "Pancake",
        "best": "-",
        "average": "n",
        "worst": "n",
        "memory": "logn",
        "stats": [
          {
            "label": "FLIPS",
            "type": "string",
            "value": "0"
          }
        ],
        "labels": {
          "en": "Pancake_sorting",
          "es": "Ordenamiento_de_panqueques",
          "fr": "Tri_de_crêpes",
          "id": "Penyortiran_panekuk",
          "zh": "煎餅排序"
        }
      },
      {
        "active": true,
        "label": "Spaghetti Sort",
        "value": "Spaghetti",
        "best": "n + k",
        "average": "n + k",
        "worst": "n + k",
        "memory": "n + k",
        "labels": {
          "en": "Spaghetti_sort",
          "es": undefined,
          "fr": "Tri_spaghetti",
          "id": "Menyortir_spageti",
          "zh": undefined
        }
      },
      {
        "active": true,
        "label": "Bitonic Sort",
        "value": "Bitonic",
        "best": "log^(2)n",
        "average": "log^(2)n",
        "worst": "nlog^(2)n",
        "memory": "1",
        "labels": {
          "en": "Bitonic_sorter",
          "es": "Ordenamiento_bitónico",
          "fr": "Tri_bitonique",
          "id": undefined,
          "zh": undefined
        }
      },
      {
        "active": true,
        "label": "Stooge Sort",
        "value": "Stooge",
        "best": "n^(log3/log1.5)",
        "average": "n^(log3/log1.5)",
        "worst": "n^(log3/log1.5)",
        "memory": "n",
        "labels": {
          "en": "Stooge_sort",
          "es": undefined,
          "fr": "Tri_faire-valoir",
          "id": undefined,
          "zh": "臭皮匠排序"
        }
      },
      {
        "active": true,
        "label": "Slow Sort",
        "value": "Slow",
        "best": "nlog^(n)",
        "average": "nlog^(n)",
        "worst": "nlog^(n)",
        "memory": "n",
        "labels": {
          "en": "Slowsort",
          "es": undefined,
          "fr": undefined,
          "id": undefined,
          "zh": "慢速排序"
        }
      },
      {
        "active": true,
        "label": "Bogo Sort",
        "value": "Bogo",
        "best": "n",
        "average": "(n · n!)",
        "worst": "infinity",
        "memory": "1",
        "labels": {
          "en": "Bogosort",
          "es": "Stupid_sort",
          "fr": "Tri_stupide",
          "id": undefined,
          "zh": "Bogo排序"
        }
      }
    ]
  },
  {
    "category": "Nonsensical",
    "algorithms": [
      {
        "active": true,
        "label": "Purge Sort",
        "value": "Purge",
        "best": "-",
        "average": "-",
        "worst": "-",
        "memory": "",
        "stats": [
          {
            "label": "PURGES",
            "type": "string",
            "value": "0"
          }
        ],
        "labels": {
          "en": "Sorting_algorithm",
          "es": "Algoritmo_de_ordenamiento",
          "fr": "Algorithme_de_tri",
          "id": "Algoritme_penyortiran",
          "zh": "排序算法"
        }
      },
      {
        "active": true,
        "label": "Thanos Sort",
        "value": "Thanos",
        "best": "-",
        "average": "-",
        "worst": "-",
        "memory": "",
        "labels": {
          "en": "Sorting_algorithm",
          "es": "Algoritmo_de_ordenamiento",
          "fr": "Algorithme_de_tri",
          "id": "Algoritme_penyortiran",
          "zh": "排序算法"
        }
      }
    ]
  },
  {
    "category": "System",
    "algorithms": [
      {
        "active": true,
        "label": "JavaScript Sort",
        "value": "JavaScript",
        "best": "-",
        "average": "-",
        "worst": "-",
        "memory": "-",
        "labels": {
          "en": "Sorting_algorithm",
          "es": "Algoritmo_de_ordenamiento",
          "fr": "Algorithme_de_tri",
          "id": "Algoritme_penyortiran",
          "zh": "排序算法"
        }
      }
    ]
  }
];