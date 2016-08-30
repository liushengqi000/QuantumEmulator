/*
https://quantumexperience.ng.bluemix.net/qstage/
Example Multi7x7Mod15:
  qua=new quaBuilder(4);
  qua.init().x(1).x(2).x(3).x(0).x(1).x(2).x(3).cx(2,1).cx(1,2).cx(2,1).cx(1,0).cx(0,1).cx(1,0).cx(3,0).cx(0,3).cx(3,0).show()
*/
var quaBuilder=function(byteNum){
	//[a,b,c,d]=>[a+b*sqrt(2)]+[c+d*sqrt(2)]i;
	var i,j,k;
	var status,bytes=byteNum?byteNum:5;
	
	function probC(a){
		return Math.pow(a[0],2)+2*Math.pow(a[1],2)+Math.pow(a[2],2)+2*Math.pow(a[3],2)+(a[0]*a[1]+a[2]*a[3])*2*Math.sqrt(2);
	}
	function strC(a){
		return "["+a[0]+(a[1]<0?"":"+")+a[1]+"*sqrt(2)]+["+a[2]+(a[3]<0?"":"+")+a[3]+"*sqrt(2)]i";
	}
	function dec2bin(a){
		return ("0000"+a.toString(2)).substr(-bytes);
	}

	function mulC(a,b){
		return [
			a[0]*b[0]+2*a[1]*b[1]-a[2]*b[2]-2*a[3]*b[3],
			a[0]*b[1]+a[1]*b[0]-a[2]*b[3]-a[3]*b[2],
			a[0]*b[2]+a[2]*b[0]+2*a[1]*b[3]+2*a[3]*b[1],
			a[0]*b[3]+a[3]*b[0]+a[1]*b[2]+a[2]*b[1]
		];
        }
	function addC(a,b){
		return [a[0]+b[0],a[1]+b[1],a[2]+b[2],a[3]+b[3]];
        }
	function subC(a,b){
		return [a[0]-b[0],a[1]-b[1],a[2]-b[2],a[3]-b[3]];
        }

	function exC(a,b,ex){
		var tmp0,tmp1;
		tmp0=addC(mulC(a,ex[0][0]),mulC(b,ex[0][1]));
		tmp1=addC(mulC(a,ex[1][0]),mulC(b,ex[1][1]));
		return [tmp0,tmp1];
	}
	function singleGate(target,ex){
		var tmp,mask=1<<(bytes-target-1);
		for(var i=0;i<(1<<bytes);i++){
			if(i&mask)continue;
			tmp=exC(status[i],status[i|mask],ex);
			status[i]=tmp[0];
			status[i|mask]=tmp[1];
		}
	}
	
	this.init=function(){
		status=[];
		for(var i=0;i<(1<<bytes);i++){
			status.push([0,0,0,0]);
		}
		status[0]=[1,0,0,0];
		return this;
	}
	this.show=function(){
		var tmp={};
		for(var i=0;i<(1<<bytes);i++){
			tmp[dec2bin(i)]=probC(status[i])+","+strC(status[i]);
		}
		console.dir(tmp);
	}
	this.x=function(target){
		singleGate(target,[
			[[0,0,0,0],[1,0,0,0]],
			[[1,0,0,0],[0,0,0,0]]
		]);
		return this;
	}
	this.y=function(target){
		singleGate(target,[
			[[0,0,0,0],[0,0,-1,0]],
			[[0,0,1,0],[0,0,0,0]]
		]);
		return this;
	}
	this.z=function(target){
		singleGate(target,[
			[[1,0,0,0],[0,0,0,0]],
			[[0,0,0,0],[-1,0,0,0]]
		]);
		return this;
	}
	this.s=function(target){
		singleGate(target,[
			[[1,0,0,0],[0,0,0,0]],
			[[0,0,0,0],[0,0,1,0]]
		]);
		return this;
	}
	this.sdg=function(target){
		singleGate(target,[
			[[1,0,0,0],[0,0,0,0]],
			[[0,0,0,0],[0,0,-1,0]]
		]);
		return this;
	}
	this.t=function(target){
		singleGate(target,[
			[[1,0,0,0],[0,0,0,0]],
			[[0,0,0,0],[0,0.5,0,0.5]]
		]);
		return this;
	}
	this.tdg=function(target){
		singleGate(target,[
			[[1,0,0,0],[0,0,0,0]],
			[[0,0,0,0],[0,0.5,0,-0.5]]
		]);
		return this;
	}
	this.h=function(target){
		singleGate(target,[
			[[0,0.5,0,0],[0,0.5,0,0]],
			[[0,0.5,0,0],[0,-0.5,0,0]]
		]);
		return this;
	}
	this.cx=function(control,target){
		var maskc=(1<<(bytes-control-1)),maskt=(1<<(bytes-target-1)),tmp;
		for(var i=0;i<(1<<bytes);i++){
			if((i&maskc)==0||(i&maskt))continue;
			tmp=exC(status[i],status[i|maskt],[
				[[0,0,0,0],[1,0,0,0]],
				[[1,0,0,0],[0,0,0,0]]
			]);
			status[i]=tmp[0];
			status[i|maskt]=tmp[1];
		}
		return this;
	}
	this.id=function(){
	}
}
