// Problem: Rotate an array of n elements to the right by k steps. For example,
// with n = 7 and k = 3, the array [1,2,3,4,5,6,7] is rotated to [5,6,7,1,2,3,4]. 
let nums = [1, 2, 3, 4, 5, 6, 7, 8]
let k = 9;

function splitAndReferseArr(arr, k) {
    k = k > arr.length ? k % arr.length: k;
    arrRight = new Array(arr.length - k);
    arrLeft = new Array(arr.length - arrRight.length);
    mergedArr = new Array(arr.length);
    for(let i = 0; i < k; i++){
        arrLeft[i] = arr[i];
    }
    for(let i = k, j = 0; i < arr.length; i++, j++){
        arrRight[j] = arr[i];
    }
    return mergedArr = [...arrRight, ...arrLeft];
}


const twoArr = splitAndReferseArr(nums, k);
console.log(twoArr);

