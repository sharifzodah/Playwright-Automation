function isStringPalindrome(str) {
    if(str === null){
        return null;
    }
    if (str.length === 0) {
        return "No text provided";
    }
    if (str.length === 1) {
        return str;
    }

    for (let i = 0, j = str.length-1; i < j; i++, j--) {
        return str[i] !== str[j] ? false : true;
    }
}
s = "null";
console.log(s.charCodeAt(3))
const result = isStringPalindrome(s);
console.log(result)
