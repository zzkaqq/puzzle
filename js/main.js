var Puzzles = function(){   //拼图对象
    var sourceMap = {};     //拼图对象序列映射表
    var box = $('#puzzles');    //容器对象
    var spaceObj = {};      //空白格对象
    var GNumber = 0;
    var init = this.init = function(number) {   //初始化,参数：初始化出N*N的格子
        GNumber = number;
        var boxWidth = parseInt(50*number)+1+'px';
        $('#puzzles').css({width:boxWidth,height:boxWidth});
        var count = number*number;
        for(var i=0;i<count;i++){
            var row = i%number;   //行
            var column = parseInt(i/number);   //列
            var left = row*50;
            var top = column*50;
            var tpl = (i<count-1) && '<li>'+(i+1)+'</li>' || '<li id="space">&nbsp;</li>';
            //var item = $(tpl).appendTo(box).css({'left':left,'top':top});
            var item = $(tpl).appendTo(box).setTranslate(left,top).data('id',i);
            sourceMap[i] = {obj:item,x:row,y:column,index:i};
        }
        //封装空白格对象
        spaceObj.left = $('#space').getTranslate().left;
        spaceObj.top = $('#space').getTranslate().top;
        spaceObj.x = getXY($('#space')).x;
        spaceObj.y = getXY($('#space')).y;
        spaceObj.obj = $('#space');
        //console.log(spaceObj);
        $('#puzzles li').click(function(){
            var _this = $(this);
            if(isMove(_this)){
                moveStart(_this);
            }
        });
        $('#start').click(function(){
            randomMove();
        });
    }
    var isRandomMove = false;
    var randomMove = function(){   //随机移动（start按钮）
        if(isRandomMove) return;
        var time = 0;
        var mark = false;
        isRandomMove = setInterval(function(){
            var canMove = {};
            var index = 0;
            for(var i in sourceMap){
                if(i==GNumber*GNumber-1 || i==mark) continue;   //禁止同一方块连续被选中2次,禁止空格移动
                if(sourceMap[i].x == spaceObj.x || sourceMap[i].y == spaceObj.y){
                    if(sourceMap[i].x == spaceObj.x-1 || sourceMap[i].y == spaceObj.y-1 || sourceMap[i].x == spaceObj.x+1 || sourceMap[i].y == spaceObj.y+1){
                        canMove[index++] = sourceMap[i].obj;
                    }
                }
            }
            var random = Math.floor(Math.random()*index);
            //console.log(canMove);
            //记录本次移动的方块的索引值
            mark = canMove[random].data('id');
            moveStart(canMove[random]);
            if(time==20){
                clearInterval(isRandomMove);
                isRandomMove = false;
            }
            time++;
        },200);
    }
    var isMove = function(obj){   //判断块是否可以移动
        if(obj.attr('id')=='space'){
            return false;
        }
        var xy = getXY(obj);
        if(xy.x!=spaceObj.x && xy.y!=spaceObj.y){
            return false;
        }
        return true;
    }
    var moveStart = function(obj){      //开始移动
        var xy = getXY(obj);
        if(xy.x == spaceObj.x){
            moveY(xy.x,xy.y);
        }else if(xy.y == spaceObj.y){
            moveX(xy.x,xy.y);
        }
        //判断是否成功
        isSuccess();
    }
    var moveX = function(x,y){     //移动行
        var diff = Math.abs(x - spaceObj.x);
        var updateXYObj = {};       //存储方块移动后的坐标
        for(var i=0;i<diff;i++){    //循环所有需要移动的数字方块
            var index = (spaceObj.x>x) && parseInt(x) + parseInt(i) || parseInt(x) - parseInt(i);
            //var obj = box.find('li[data-x='+index+'][data-y='+y+']');
            var item = getsourceMapItemByXY(index,y);
            var obj = item.obj;
            //移动位置
            var lt = obj.getTranslate();
            var left = lt.left;
            if(spaceObj.x>x){
                left = parseInt(left)+50;
                var XYObj = {obj:obj,x:parseInt(item.x)+1,y:y};
            }else{
                left -= 50;
                var XYObj = {obj:obj,x:parseInt(item.x)-1,y:y};
            }
            obj.setTranslate(left);
            updateXYObj[i] = XYObj;
        }
        //更新移动格的坐标
        updateXY(updateXYObj);
        //更新空白格的坐标和位置
        spaceObj.obj.setTranslate(x*50,"");
        spaceObj.x = x;
        spaceObj.left = x*50;
    }
    var moveY = function(x,y){     //移动列
        var diff = Math.abs(y - spaceObj.y);
        var updateXYObj = {};       //存储方块移动后的坐标
        for(var i=0;i<diff;i++){    //循环所有需要移动的数字方块
            var index = (spaceObj.y>y) && parseInt(y) + parseInt(i) || parseInt(y) - parseInt(i);
            //var obj = box.find('li[data-x='+x+'][data-y='+index+']');
            var item = getsourceMapItemByXY(x,index);
            var obj = item.obj;
            //移动位置
            var lt = obj.getTranslate();
            var top = lt.top;
            if(spaceObj.y>y){
                top = parseInt(top)+50;
                var XYObj = {obj:obj,x:x,y:parseInt(item.y)+1};
            }else{
                top -= 50;
                var XYObj = {obj:obj,x:x,y:parseInt(item.y)-1};
            }
            obj.setTranslate('',top);
            updateXYObj[i] = XYObj;
        }
        //更新移动格的坐标
        updateXY(updateXYObj);
        //更新空白格的坐标和位置
        spaceObj.obj.setTranslate('',y*50);
        spaceObj.y = y;
        spaceObj.top = y*50;
    }
    var updateXY = function(obj){   //更新坐标
        for(var i in obj){
            var id = obj[i].obj.data('id');
            sourceMap[id].x = obj[i].x;
            sourceMap[id].y = obj[i].y;
        }
    }
    var getsourceMapItemByXY = function(x,y){
        if((x!=0 && !x) || (y!=0 && !y)) return;
        var result = '';
        for(var i in sourceMap){
            if(sourceMap[i].x == x && sourceMap[i].y==y){
                result = sourceMap[i];
                break;
            }
        }
        return result;
    }
    var getXY = function(obj){  //获取元素行列坐标,返回一个带json对象：{x:(string类型数字),y:(string类型数字)}
        if(typeof obj !== 'object'){
            return;
        }
        var ret = {};
        var id = obj.data('id');
        ret.x = sourceMap[id].x;    //行
        ret.y = sourceMap[id].y;     //列
        return ret;
    }
    var isSuccess = function(){
        var success = true;
        for(var i in sourceMap){
            var x = sourceMap[i].x;
            var y = sourceMap[i].y;
            var index = (y*GNumber)+x;
            if(index != i){
                success = false;
                break;
            }
        }
        if(success){
            $('#tips').text('你赢啦！！').show();
        }
    }
}
