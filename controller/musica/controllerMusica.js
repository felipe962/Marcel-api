/**************************************************************************************
 * Objetivo: Controller responsavel pela manipulação do CRUD de dados de música
 * Data: 13/02/25
 * Autor: Bahia 
 * Versão: 1.0
 *************************************************************************************/

const MESSAGE = require('../../modulo/config.js')



//Import do arquivo DAO de música para manipular o BD
const musicaDAO = require('../../model/DAO/musica.js')

//Função para inserir uma música
const inserirMusica = async function(musica, contentType){
    try {

        if(String(contentType).toLowerCase() == 'application/json')

        {

        if( musica.nome             == undefined || musica.nome                     == ''        || musica.nome                     == null        || musica.nome.lenght                 > 80     ||
            musica.link             == undefined || musica.link                     == ''        || musica.link                     == null        || musica.link.lenght                 > 200    ||
            musica.duracao          == undefined || musica.duracao                  == ''        || musica.duracao                  == null        || musica.duracao.lenght              > 5      ||
            musica.data_lancamento  == undefined || musica.data_lancamento          == ''        || musica.data_lancamento          == null        || musica.data_lancamento.lenght      > 10     ||
            musica.foto_capa        == undefined || musica.foto_capa.lenght         > 200        ||
            musica.letra            == undefined
       ){
           return MESSAGE.ERROR_REQUIRED_FIELDS
       }else{
           let resultMusica = await musicaDAO.insertMusica(musica)
                console.log(resultMusica)
     
                if (resultMusica)
               return MESSAGE.SUCCESS_CREATED_ITEM //201
           else
               return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
       }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error){console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }               

}
        
//Função para atualizar uma música
const atualizarMusica = async function(musica, id, contentType){
    try {
         if(String(contentType).toLowerCase() == 'application/json')
            {
                if( 
                    musica.nome               == undefined || musica.nome == ''              || musica.nome == null            || musica.nome.length > 80            ||
                    musica.link              == undefined  || musica.link == ''              || musica.link == null            || musica.link.length > 200           ||
                    musica.duracao           == undefined  || musica.duracao == ''           || musica.duracao == null         || musica.duracao.length > 5          ||
                    musica.data_lancamento   == undefined  || musica.data_lancamento == ''   || musica.data_lancamento == null || musica.data_lancamento.length > 10 ||
                    musica.foto_capa         == undefined  || musica.foto_capa.length > 200  ||
                    musica.letra             == undefined  ||
                    id =='' || id == undefined || id == null || isNaN(id) || id <= 0
                    
                
                ){
                    return MESSAGE.ERROR_REQUIRED_FIEDLS //400
                }else{
                    // validar se o id existe no banco bd

                    let resultMusica = await buscarMusica(id)

                    if (resultMusica.status_code == 200){
                        //update
                        // Adiciona o atributo ID no JSON e coloca o id da musica que chegou na controller 
                        musica.id = id
                        let result = await musicaDAO.updateMusica(musica)

                        if(result){
                            return MESSAGE.SUCCES_UPDATE_ITEM //200
                        }else{
                            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                        }

                    }else if (resultMusica.status_code == 404){
                        return MESSAGE.ERROR_NOT_FOUND //404
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
                    }
                }
            }else{
                return MESSAGE.ERROR_CONTENT_TYPE //415
            }
        
    } catch (error) {console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}


//Função para excluir uma música
const excluirMusica = async function(id){
    try {
        if(id == '' || id == undefined || id == null || isNaN(id) || id <=0 ){
            return MESSAGE.ERROR_REQUIRED_FIEDLS//400      
        }else{
            //VALIDAR se o ID existe
            let resultMusica = await buscarMusica(id)

            if(resultMusica.status_code == 200){
                //DELETE
                let result = await musicaDAO.deletMusica(id)
                if(result){
                    return MESSAGE.SUCCESS_DELETED_ITEM
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL//500
                }
            }else if(resultMusica.status_code == 404){
                return  MESSAGE.ERROR_NOT_FOUND //404
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
            }
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500
    }
}

//Função para listar uma música
const listarMusica = async function(){
    try {
        let dadosMusica = {}
        //Chamar a função que retorna todas as músicas
        let resultMusica = await musicaDAO.selectAllMusica()

        if (resultMusica != false || typeof(resultMusica) == 'object')

        
    
    if (resultMusica != false){
        if(resultMusica.length > 0){
            //Criando um objeto JSON para retornar a lista de músicas
            dadosMusica.status = true
            dadosMusica.status_code = 200
            dadosMusica.itens = resultMusica.length
            dadosMusica.musica = resultMusica
            
            
            return dadosMusica //200
        }else{
            return MESSAGE.ERROR_NOT_FOUND //404
        }
    }else{
        
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
    }

    
    
    
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500 
    }
    
}

//Função para buscar uma música
const buscarMusica = async function(id){
    try {
        if(id == '' || id == undefined || id == null || isNaN(id) || id <=0 ){
            return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500      
        }else{    
            let dadosMusica = {}
            let resultMusica = await musicaDAO.selectByIdMusica(id)

            if(resultMusica != false || typeof(resultMusica) == 'object'){
                if(resultMusica.length > 0){
                    //Criando um objeto JSON para retornar a lista de músicas
                    dadosMusica.status = true
                    dadosMusica.status_code = 200
                    dadosMusica.musica = resultMusica
                    return dadosMusica //200
                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL//500
            }
        }
    } catch (error) {
    return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER //500
    }
    
}
//GENERO GENERO GENERO GENERO GENERO GENERO GENERO GENERO GENERO GENERO GENERO GENERO GENERO GENERO GENERO GENERO GENERO GENERO GENERO GENERO GENERO

const inserirGenero = async function(genero, contentType){
    try {

        if(String(contentType).toLowerCase() == 'application/json')

        {

        if( genero.nome             == undefined || genero.nome                     == ''        || genero.nome                     == null        || genero.nome.lenght                 > 80     
            
       ){
           return MESSAGE.ERROR_REQUIRED_FIELDS
       }else{
           let resultMusica = await musicaDAO.insertGenero(genero)
                console.log(resultMusica)
     
                if (resultMusica)
               return MESSAGE.SUCCESS_CREATED_ITEM //201
           else
               return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
       }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error){console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }               

}

const deletGenero = async function(id){
    try {
        if(id == '' || id == undefined || id == null || isNaN(id) || id <=0 ){
            return MESSAGE.ERROR_REQUIRED_FIEDLS//400      
        }else{
            //VALIDAR se o ID existe
            let resultGenero = await buscarGenero(id)

            if(resultGenero.status_code == 200){
                //DELETE
                let result = await musicaDAO.deletGenero(id)
                if(result){
                    return MESSAGE.SUCCESS_DELETED_ITEM
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL//500
                }
            }else if(resultMusica.status_code == 404){
                return  MESSAGE.ERROR_NOT_FOUND //404
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
            }
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER//500
    }
}

const buscarGenero = async function(id){
    try {
        if(id == '' || id == undefined || id == null || isNaN(id) || id <=0 ){
            return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500      
        }else{    
            let dadosGenero = {}
            let resultMusica = await musicaDAO.selectByIdGenero(id)

            if(resultMusica != false || typeof(resultMusica) == 'object'){
                if(resultMusica.length > 0){
                    //Criando um objeto JSON para retornar a lista de músicas
                    dadosGenero.status = true
                    dadosGenero.status_code = 200
                    dadosGenero.musica = resultMusica
                    return dadosGenero //200
                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL//500
            }
        }
    } catch (error) {
    return MESSAGE.ERRO_INTERNAL_SERVER_CONTROLLER //500
    }
    
}

const listarGenero = async function(){
    try {
        let dadosGenero = {}
        //Chamar a função que retorna todas as músicas
        let resultMusica = await musicaDAO.selectAllGenero()

        if (resultMusica != false || typeof(resultMusica) == 'object')

        
    
    if (resultMusica != false){
        if(resultMusica.length > 0){
            //Criando um objeto JSON para retornar a lista de músicas
            dadosGenero.status = true
            dadosGenero.status_code = 200
            dadosGenero.itens = resultMusica.length
            dadosGenero.musica = resultMusica
            
            
            return dadosMusica //200
        }else{
            return MESSAGE.ERROR_NOT_FOUND //404
        }
    }else{
        
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
    }

    
    
    
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500 
    }
    
}


const atualizargenero = async function(genero, id, contentType){
    try {
         if(String(contentType).toLowerCase() == 'application/json')
            {
                if( 
                    genero.nome               == undefined || genero.nome == ''              || genero.nome == null            || genero.nome.length > 80       
                
                    
                
                ){
                    return MESSAGE.ERROR_REQUIRED_FIEDLS //400
                }else{
                    // validar se o id existe no banco bd

                    let resultMusica = await buscarGenero(id)

                    if (resultMusica.status_code == 200){
                        //update
                        // Adiciona o atributo ID no JSON e coloca o id da musica que chegou na controller 
                        genero.id = id
                        let result = await musicaDAO.updateGenero(genero)

                        if(result){
                            return MESSAGE.SUCCES_UPDATE_ITEM //200
                        }else{
                            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                        }

                    }else if (resultMusica.status_code == 404){
                        return MESSAGE.ERROR_NOT_FOUND //404
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
                    }
                }
            }else{
                return MESSAGE.ERROR_CONTENT_TYPE //415
            }
        
    } catch (error) {console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}
    //USUARIO USUARIO USUARIO USUARIO USUARIO USUARIO USUARIO USUARIO USUARIO USUARIO USUARIO USUARIO USUARIO USUARIO USUARIO USUARIO USUARIO USUARIO USUARIO

    const inserirUsuario = async function(usuario, contentType){
        try {
    
            if(String(contentType).toLowerCase() == 'application/json')
    
            {
    
            if( usuario.nome                 == undefined || usuario.nome                       == ''        || usuario.nome                      == null        || usuario.nome.lenght                 > 80     ||
                usuario.email                == undefined || usuario.email                       == ''       || usuario.email                     == null        || usuario.emaillenght                 > 200       ||
                usuario.senha                == undefined || usuario.senha                      == ''        || usuario.senha                 == null        || usuario.senha.lenght              > 5      ||
                usuario.data_nascimento      == undefined || usuario.data_nascimento            == ''        || usuario.data_nascimento           == null        || usuario.data_nascimento.lenght      > 10     ||
                usuario.assinatura           == undefined || usuario.assinatura                 == ''        || usuario.assinatura      == null        || usuario.assinatura.lenght      > 10     ||
                usuario.foto_perfil          == undefined || usuario.foto_perfil.lenght         > 200        ||
                id =='' || id == undefined || id == null || isNaN(id) || id <= 0
           ){
               return MESSAGE.ERROR_REQUIRED_FIELDS
           }else{
               let resultMusica = await musicaDAO.insertUsuario(usuario)
                    console.log(resultMusica)
         
                    if (resultMusica)
                   return MESSAGE.SUCCESS_CREATED_ITEM //201
               else
                   return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
           }
            }else{
                return MESSAGE.ERROR_CONTENT_TYPE //415
            }
        } catch (error){console.log(error)
            return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
        }               
    
    }

module.exports = {
  inserirMusica,
  atualizarMusica,
  excluirMusica,
  listarMusica,
  buscarMusica,
  inserirGenero,
  deletGenero,
  buscarGenero,
  listarGenero,
  atualizargenero
}