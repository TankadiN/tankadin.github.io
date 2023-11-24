var x = 0;
function Move()
{
    x-=0.5;
    $('body').css('background-position', x + 'px 0');
}

var movenemt = setInterval(()=>{Move()}, 10)