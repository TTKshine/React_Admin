// 将日期格式化为固定的格式
export function formateDate(time){
    if(!time) return '';
    let date = new Date(time)
    return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
    +' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
}