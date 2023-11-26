export function getRandomName(length) {
    function randomAccess(min, max) {
      return Math.floor(Math.random() * (min - max) + max);
    }
    let name = '';
    for (let i = 0; i < length; i++) {
      name += String.fromCharCode(randomAccess(0x4e00, 0x9fa5));
    }
    return name;
  }

//   生成随机验证码函数
export function generateSMSCode(length=4) {
    let code = "";
    let possible = "0123456789"; // 可能的验证码字符（仅限数字）
  
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * possible.length);
       code += possible.charAt(randomIndex);
    }
  
    return code;
}