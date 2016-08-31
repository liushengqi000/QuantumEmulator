/*
https://quantumexperience.ng.bluemix.net/qstage/
Example Multi7x7Mod15:
  qua=new quaBuilder();
  qua.init(4).x(1).x(2).x(3).x(0).x(1).x(2).x(3).cx(2,1).cx(1,2).cx(2,1).cx(1,0).cx(0,1).cx(1,0).cx(3,0).cx(0,3).cx(3,0).show()
*/

var quaBuilder=function(){
	var status,bytes;
}
quaBuilder.prototype=(function(){
	var i,j,k;
	function probC(a){
		return Math.pow(a[0],2)+2*Math.pow(a[1],2)+Math.pow(a[2],2)+2*Math.pow(a[3],2)+(a[0]*a[1]+a[2]*a[3])*2*Math.sqrt(2);
	}
	function strC(a){
		return "["+a[0]+(a[1]<0?"":"+")+a[1]+"*sqrt(2)]+["+a[2]+(a[3]<0?"":"+")+a[3]+"*sqrt(2)]i";
	}
	function dec2bin(a,b){
		return ("0".repeat(b)+a.toString(2)).substr(-b);
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
		var tmp,mask=1<<(this.bytes-target-1);
		for(var i=0;i<this.status.length;i++){
			if(i&mask)continue;
			tmp=exC(this.status[i],this.status[i|mask],ex);
			this.status[i]=tmp[0];
			this.status[i|mask]=tmp[1];
		}
	}
	return {
		init:function(byteNum){
			this.bytes=byteNum?byteNum:5
			this.status=[];
			for(var i=0;i<(1<<this.bytes);i++){
				this.status.push([0,0,0,0]);
			}
			this.status[0]=[1,0,0,0];
			return this;
		},
		show:function(){
			var tmp={};
			for(var i=0;i<this.status.length;i++){
				tmp[dec2bin(i,this.bytes)]=probC(this.status[i])+","+strC(this.status[i]);
			}
			console.dir(tmp);
		},
		x:function(target){
			singleGate.apply(this,[target,[
				[[0,0,0,0],[1,0,0,0]],
				[[1,0,0,0],[0,0,0,0]]
			]]);
			return this;
		},
		y:function(target){
			singleGate.apply(this,[target,[
				[[0,0,0,0],[0,0,-1,0]],
				[[0,0,1,0],[0,0,0,0]]
			]]);
			return this;
		},
		z:function(target){
			singleGate.apply(this,[target,[
				[[1,0,0,0],[0,0,0,0]],
				[[0,0,0,0],[-1,0,0,0]]
			]]);
			return this;
		},
		s:function(target){
			singleGate.apply(this,[target,[
				[[1,0,0,0],[0,0,0,0]],
				[[0,0,0,0],[0,0,1,0]]
			]]);
			return this;
		},
		sdg:function(target){
			singleGate.apply(this,[target,[
				[[1,0,0,0],[0,0,0,0]],
				[[0,0,0,0],[0,0,-1,0]]
			]]);
			return this;
		},
		t:function(target){
			singleGate.apply(this,[target,[
				[[1,0,0,0],[0,0,0,0]],
				[[0,0,0,0],[0,0.5,0,0.5]]
			]]);
			return this;
		},
		tdg:function(target){
			singleGate.apply(this,[target,[
				[[1,0,0,0],[0,0,0,0]],
				[[0,0,0,0],[0,0.5,0,-0.5]]
			]]);
			return this;
		},
		h:function(target){
			singleGate.apply(this,[target,[
				[[0,0.5,0,0],[0,0.5,0,0]],
				[[0,0.5,0,0],[0,-0.5,0,0]]
			]]);
			return this;
		},
		cx:function(control,target){
			var maskc=(1<<(this.bytes-control-1)),maskt=(1<<(this.bytes-target-1)),tmp;
			for(var i=0;i<this.status.length;i++){
				if((i&maskc)==0||(i&maskt))continue;
				tmp=exC(this.status[i],this.status[i|maskt],[
					[[0,0,0,0],[1,0,0,0]],
					[[1,0,0,0],[0,0,0,0]]
				]);
				this.status[i]=tmp[0];
				this.status[i|maskt]=tmp[1];
			}
			return this;
		},
		id:function(){
			return this;
		}
	}
})()
quaBuilder.prototype.constructor=quaBuilder;
