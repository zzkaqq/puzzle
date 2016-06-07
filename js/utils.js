$.fn.extend({
    setTranslate:function(left,top){      //为Dom对象设置translate3d的位移状态
        var _this = $(this);
        if((left==undefined || left=="") && left!==0){
            var translate = _this.getTranslate();
            left = translate && translate.left || 0;
        }
        if((top==undefined || top=="") && top!==0){
            var translate = _this.getTranslate();
            top = translate && translate.top || 0;
        }
        left = left+'px';
        top = top+'px';
        return _this.css({transform: 'translate3d('+left+','+top+',0)'})
    },
    getTranslate:function(){        //获取Dom对象的translate3d的偏移位置，返回left和top的偏移值
        var transform = $(this).css('transform');
        if(transform == 'none') return;
        var reg =new RegExp("\\((.| )+?\\)","igm");
        transform = transform.match(reg);
        transform = transform[0].split('(').join().split(')').join().split(',');
        !transform[transform.length-1] && transform.pop();
        var y = transform[transform.length-1].trim();
        var x = transform[transform.length-2].trim();
        return {left:x,top:y};
    },
    
});
String.prototype.trim=function() {
    return this.replace(/(^\s*)|(\s*$)/g,'');
}
String.prototype.getNumber = function(str){     //提取字符串中的数字
    return str.replace(/[^0-9]/ig,"");
}