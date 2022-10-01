const DB8Validator = {
    handleSubmit: (event)=>{
        event.preventDefault();
        /**
         * O evento capturado é um objeto com muitas informações.
         * Ele apresenta um atributo chamado target que contem o formulário.
         * Para salvar esse formulário é só atribuir a uma variável
         * utilizando o processo de destruturação.
         */
        const { target: formEvent } = event;
        
        /**
         * Para capturar os inputs do formulário é só atribuir a uma
         * outra variável o atributo "elements" que contém todos os 
         * inputs, inclusive textArea e select. O método filter é utilizado
         * para desconsiderar o input com type='submit'.
         */

        const inputs = [...formEvent.elements].filter((input)=>{
            return input.type !== 'submit';
        });

        DB8Validator.clearErrors(inputs);

        if(DB8Validator.validate(inputs) === true){
            formEvent.submit();
        }
    },
    checkInput:(input, inputs)=>{
        let rules = input.getAttribute('data-rules');

        if(rules !== null){
           const arrayRules = rules.split('|');
           for(let rule of arrayRules){
                const rDetails = rule.split('=');
                switch (rDetails[0]){
                    case 'required':
                        if(input.value === ''){
                            return 'Campo não pode ser vazio.';
                        }
                    break;
                    case 'min':    
                        if(input.value.length < rDetails[1]){
                            return 'O campo deve ter pelo menos ' +
                            rDetails[1] +
                            ' caracteres.'
                        }
                    break;
                    case 'email':
                        if(input.value !== ''){
                            let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            if(!regex.test(input.value.toLowerCase())){
                                return 'Digite um e-mail válido.'
                            }
                        }

                    break;
                    case 'password':
                        const iqualPassword = inputs
                            .filter((inputPassword)=>inputPassword.type === "password")
                            .every((password, _, [firstPassword])=>password.value === firstPassword.value);
                        if(!iqualPassword){
                            return 'Senhas não correspondem.'
                        }
                    break;
                }
           }
        }

        return true;
    },
    validate(inputs){
        return inputs
                    .map((input, _, inputs)=>{
                        const check = DB8Validator.checkInput(input, inputs);
                        if(check !== true) {
                            DB8Validator.showError(input, check);
                            return false;
                        } else {
                            return true;
                        }
                    })
                    .every(Boolean);
    },
    showError:(input, check)=>{
        input.style.borderColor = '#FF0000';
        const div = document.createElement('div');
        div.classList.add('error');
        div.innerHTML = check;
        input.parentNode.appendChild(div);
    },
    clearErrors:(inputs)=>{
        inputs.forEach((input)=>{
            input.style.borderColor = '#999';
            const divError = input.parentNode.querySelector('.error');
            if(divError){
                divError.remove();
            }
        });
    }
}

const form = document.querySelector('.db8validator');
form.addEventListener('submit', DB8Validator.handleSubmit);


/**
 * um jeito mais elegante e que resolveria para qualquer situação onde você precisasse validar se todos os itens de um array são iguais (por exemplo se você estiver fazendo validação de CPF), seria uma função como essa daqui:
const areAllEqual = (values) => {
  return values.every((value, _, [head]) => value === head);
};
  
Ai você poderia usar essa função na sua validação da seguinte forma:
// Usando o spread (...) para converter de NodeList para Array
const passwords = [...form.querySelectorAll(".password")];
if (!areAllEqual(passwords.map(({value}) => value))) {
  return "Senhas não coincidem";
}
 */

