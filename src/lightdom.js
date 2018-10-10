/*

querySelector wrapper, inheriting from the Array class.

https://github.com/kpion/lightdom
v. 1.1.0

Log:
1.0.1 - initial vesion
1.1.0 - the .each function now passes new LightDom (element), use .forEach if HTMLElement/Element is needed.
        .parent returns only unique parents.
*/
(function (window) {
 
    class LightDom extends Array{

        constructor(parameter = null, context = null) {
            super();
            this.context = context || document;
            this.add(parameter,context);
        }

        //internal use only
        add(parameter, context = null){
            let nodes = null;//used only if adding from array / other LightDom instance
            if (typeof parameter === 'string' && parameter !== '') {
                //Object.assign(this, Array.from(this.context.querySelectorAll(parameter)));
                parameter = parameter.trim();
                if (parameter[0] === '<') {
                    nodes = Array.from(this.create(parameter));
                }else{                
                    nodes = Array.from(this.context.querySelectorAll(parameter));
                }
            } else if (parameter instanceof Element) {//used to be HTMLElement before v. 1.0.1
                this.push (parameter);
            } else if (parameter instanceof NodeList || parameter instanceof HTMLCollection || parameter instanceof Array) {
                //Object.assign(this, Array.from(parameter));
                nodes = Array.from(parameter);
            } else if (parameter instanceof LightDom) {
                //copying ourselves to ourselves
                //Object.assign(this, parameter);
                nodes = parameter;
            }else{
                //acceptable in certain situations only, like calling e.g. l().setLogging(false);
            }
            if(nodes){//only if adding from array / other LightDom instance
                if(this.length === 0){
                    Object.assign(this, nodes);
                }else{
                    nodes.forEach(el => this.push(el));
                }
            }
            return this;
        }

        each(callback){
            this.forEach(node => callback(new LightDom(node)));
            return this;
        }

        //our version, only difference is that we return "this".
        forEach(callback){
            super.forEach(callback);
            return this;
        }

        //rather for internal use only, used e.g. by .parent() or .closest(), returns array of *nodes*
        unique () {
            return super.filter((node, pos) => {
              return super.indexOf(node) == pos;
            });
        };

        //rather for internal use only, similar to Array.reverse, except it doesn't modify current object 
        //but only returns a modified one. Returns array of *nodes*
        reversed(){
            return Array.from(this).reverse();
        }

        filter(parameter = null){
            if(typeof parameter === 'string'){
                return new LightDom(super.filter(el => el.matches(parameter)));
            }
            if(parameter === null){
                return new LightDom(this);
            }
            //must be a function:
            return new LightDom(super.filter(parameter));
            
        }

        //only for those who expect this method here. Because we are just an array.
        get(index){
            if(typeof index === 'undefined'){//this is what jquery does too.
                return this;
            }
            return this[index];
        }

        // Find all the nodes CHILDREN of the current ones, matched by a selector
        find (parameter) {
           let result = new LightDom();
           this.forEach(node => {
               result.add(node.querySelectorAll(parameter))
           })
           return result;
        };

        //Get (unique) parents of all nodes.
        parent () {
            let result = new LightDom();
            this.forEach(node => {
                result.add(node.parentNode)
            })
            return result.unique();
        };

        // Get the closest (by selector) parents of all nodes
        closest (parameter) {
            let result = new LightDom();
            this.forEach(node => {
                while((node = node.parentNode) && (node !== document)){
                    if(node.matches (parameter)){
                        result.add(node);
                        break;
                    }
                }
            })
            return result.unique();
        };

        is(parameter){
            return this.some(node => node.matches(parameter));
        }

        css(property,val = null){
            if(val === null){
                return this[0] ? this[0].style[property] : null;
            }
            return this.forEach(node => {
                node.style[property] = val;
            })

        }

        attr(property,val = null){
            if(val === null){
                return this[0] ? this[0].getAttribute(property) : null;
            }
            return this.forEach(node => {
                node.setAttribute (property,val);
            })
        }       
        
        addClass(name){
            return this.forEach(node => {
                node.classList.add (name);
            })            
        }

        removeClass(name){
            return this.forEach(node => {
                node.classList.remove (name);
            })            
        }

        toggleClass(name){
            return this.forEach(node => {
                node.classList.toggle (name);
            })            
        }        

        html(val){
            if(val === null){
                return this[0] ? this[0].innerHTML : '';
            }
            return this.forEach(node => {
                node.innerHTML = val;
            })            
        }

        empty(){
            return this.html('');
        }

        text(val){
            if(val === null){
                return this[0] ? this[0].textContent : '';
            }
            return this.forEach(node => {
                node.textContent = val;
            })            
        }     

        insertAdjacentHTML(position, html){
            return this.forEach(node => {
                node.insertAdjacentHTML (position, html);
            })              
        }
        /*
        insertAdjacentElement(position, element){
            let lSrc = element instanceof LightDom ? element : new LightDom(element);
            return this.forEach(node => {
                //node.insertAdjacentElement (position, lElement[0]);
                lSrc.forEach(srcElem => {
                    node.insertAdjacentElement (position, srcElem);
                    
                })
            })              
        }
        */

        /** 
         * "smart" one - will insert a string html or an element (node); Depending on the type of the argument.
         * @param param - whatever (html, node, nodelist, another lightdom etc)
         * @param reverse - only when param is nodelist, lightdom etc - useful when doing .prepend and .after - 
         * we want to reverse the order of the elements first. 
         */ 
        insertElement(position, param, reverse = false){
            if(typeof param === 'string'){
                return this.insertAdjacentHTML(position, param);
            }
            let lSrc = param instanceof LightDom ? param : new LightDom(param);
            if(reverse && lSrc.length > 0){
                lSrc = lSrc.reversed();
            }
            return this.forEach(node => {
                //node.insertAdjacentElement (position, lElement[0]);
                lSrc.forEach(srcElem => {
                    node.insertAdjacentElement (position, srcElem);
                    
                })
            })         
        }

        append(param){
            return this.insertElement ('beforeend', param);
        }

        prepend(param){
            return this.insertElement ('afterbegin', param, true);
        }

        before(param){
            return this.insertElement ('beforebegin', param);
        } 

        after(param){
            return this.insertElement ('afterend', param, true);
        }        

        //creates a new element (does not add), rather for internal use only
        create(html){
            var div = document.createElement('div');
            //var div = document.createDocumentFragment();
            div.innerHTML = html;
            console.log('insider:');
            console.log('made of',html);
            console.dir(div);
            return div.childNodes;
        }

        on(type, callback, options = false){
            return this.forEach(node => {
                node.addEventListener(type, callback, options);
           });
        }

    }

    /////////
    //End of class Yes definition

    function lightdom(parameter, context = null) {
        return new LightDom(parameter, context);
    }


    //finally, it will be available under l:
    window.l = lightdom;


})(window);
