// const randomString = () => {
//     const randomStr = Array.from(Array(10), () =>
//         Math.floor(Math.random() * 36).toString(36)
//     ).join("")


//     return randomStr
// }  // orderNum 생성에 사용

// module.exports = { randomString }

const randomStringGenerator = () => {
    const randomString = Array.from(Array(10), () =>
        Math.floor(Math.random() * 36).toString(36)
    ).join("");

    console.log("randomString:", randomString)
    return randomString;
    //orderNum 만들때 씀
}

module.exports = { randomStringGenerator };