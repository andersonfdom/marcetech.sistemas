// ============================================
// CONSTANTES GLOBAIS
// ============================================

const MODAL_EXCLUSAO_ID = 'modalExclusao';
const MOBILE_BREAKPOINT = 992; // 992px - breakpoint do Bootstrap para mobile
const UF_ESTADOS = {
    'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
    'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal',
    'ES': 'Espírito Santo', 'GO': 'Goiás', 'MA': 'Maranhão',
    'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul', 'MG': 'Minas Gerais',
    'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná', 'PE': 'Pernambuco',
    'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
    'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima',
    'SC': 'Santa Catarina', 'SP': 'São Paulo', 'SE': 'Sergipe',
    'TO': 'Tocantins'
};

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

/** Remove todos os caracteres não numéricos de uma string. */
function limparCaracteresNaoNumericos(valor) {
    return valor.replace(/\D/g, '');
}

/** Formata um valor numérico para o padrão de moeda brasileiro (vírgula como separador decimal). */
function formatarDecimalBR(valor) {
    const numero = typeof valor === 'string'
        ? parseFloat(valor.replace(/\./g, '').replace(',', '.'))
        : valor;

    // Verifica se é um número válido antes de formatar
    if (isNaN(numero)) return '0,00';

    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ============================================
// FUNÇÕES DE MÁSCARAS (BASEADAS EM VALOR DE RETORNO)
// ============================================

function aplicarMascaraCPF(valor) {
    valor = limparCaracteresNaoNumericos(valor).substring(0, 11);
    return valor
        .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
        .replace(/^(\d{3})(\d{3})(\d{3})$/, '$1.$2.$3')
        .replace(/^(\d{3})(\d{3})$/, '$1.$2')
        .replace(/^(\d{3})$/, '$1');
}

function aplicarMascaraCNPJ(valor) {
    valor = limparCaracteresNaoNumericos(valor).substring(0, 14);
    return valor
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})$/, '$1.$2.$3/$4')
        .replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2.$3')
        .replace(/^(\d{2})(\d{3})$/, '$1.$2');
}

function aplicarMascaraCEP(valor) {
    valor = limparCaracteresNaoNumericos(valor).substring(0, 8);
    return valor.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

function aplicarMascaraRG(valor) {
    valor = limparCaracteresNaoNumericos(valor).substring(0, 10);
    return valor
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
        .replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2.$3')
        .replace(/^(\d{2})(\d{3})$/, '$1.$2')
        .replace(/^(\d{2})$/, '$1');
}

function aplicarMascaraTelefone(valor) {
    valor = limparCaracteresNaoNumericos(valor).substring(0, 11);

    if (valor.length > 10) { // Celular (DD) 9XXXX-XXXX
        return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (valor.length > 6) { // Telefone (DD) XXXX-XXXX
        return valor.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else if (valor.length > 2) { // DD
        return valor.replace(/^(\d{2})(\d)/, '($1) $2');
    }

    return valor;
}

// ============================================
// FUNÇÕES DE MODAL GENÉRICAS
// ============================================

/** Abre um modal Bootstrap pelo seu ID. */
function abrirModalGenerico(idModal) {
    const modal = new bootstrap.Modal(document.getElementById(idModal));
    modal.show();
}

/** 
 * Fecha um modal Bootstrap pelo seu ID.
 * @param {string} idModal - O ID do elemento modal.
 * @param {boolean} [recarregarPagina=false] - Se true, recarrega a página após fechar.
 */
function fecharModalGenerico(idModal, recarregarPagina = false) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(idModal));
    if (modal) {
        modal.hide();
        if (recarregarPagina) {
            window.location.reload();
        }
    }
}

/** 
 * Abre o modal de confirmação de exclusão.
 * @param {string} titulo - Título da mensagem de exclusão.
 * @param {string} mensagem - Corpo da mensagem.
 * @param {function} callbackConfirmacao - Função a ser executada na confirmação.
 */
function abrirModalConfirmacaoExclusao(titulo, mensagem, callbackConfirmacao) {
    const modalExclusao = new bootstrap.Modal(document.getElementById(MODAL_EXCLUSAO_ID));
    document.getElementById('tituloExclusao').textContent = titulo;
    document.getElementById('textoExclusao').textContent = mensagem;
    document.getElementById('btnConfirmaExclusao').onclick = callbackConfirmacao;
    modalExclusao.show();
}

// ============================================
// FUNÇÕES DE MENSAGENS E FEEDBACK
// ============================================

/**
 * Exibe uma mensagem em um elemento específico.
 * @param {HTMLElement} elemento - O elemento HTML onde a mensagem será exibida.
 * @param {string} texto - O conteúdo da mensagem.
 * @param {('sucesso'|'erro')} tipo - O tipo da mensagem.
 */
function exibirMensagemElemento(elemento, texto, tipo) {
    elemento.style.color = tipo === 'sucesso' ? 'green' : 'red';
    elemento.textContent = texto;
}

/**
 * Exibe uma mensagem no elemento 'mensagemGrid'.
 * @param {string} texto - O conteúdo da mensagem.
 * @param {('sucesso'|'erro'|'danger')} tipo - O tipo da mensagem.
 */
function exibirMensagemGrid(texto, tipo) {
    const elemento = document.getElementById('mensagemGrid');
    if (!elemento) return;

    elemento.style.display = 'block';
    elemento.style.color = tipo === 'sucesso' ? 'green' : 'red';
    elemento.textContent = texto;
}

// ============================================
// FUNÇÃO DE REQUISIÇÃO HTTP (AJAX)
// ============================================

/**
 * Envia uma requisição HTTP padronizada.
 * @param {string} metodo - O método HTTP (GET, POST, DELETE, etc.).
 * @param {string} url - O endpoint da API.
 * @param {object|null} dados - Os dados a serem enviados (para POST, PUT).
 * @param {object} callbacks - Funções de retorno de chamada e elementos de UI.
 * @param {function} callbacks.onSuccess - Função executada em caso de sucesso.
 * @param {function} callbacks.onError - Função executada em caso de erro.
 * @param {HTMLElement} callbacks.mensagemElement - Elemento para exibir mensagens.
 * @param {HTMLElement} callbacks.btnElement - Elemento do botão (para controle de estado).
 */
function enviarRequisicaoHTTP(metodo, url, dados, callbacks) {
    const xhr = new XMLHttpRequest();
    xhr.open(metodo, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    const { onSuccess, onError, mensagemElement, btnElement } = callbacks || {};

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {

            // Reabilita o botão, se existir
            if (btnElement) {
                btnElement.disabled = false;
                // Mantém o conteúdo original se não for um GET de carga (ex: botão salvar)
                if (metodo !== 'GET') {
                    btnElement.innerHTML = 'Salvar'; // Assumindo "Salvar" como padrão após requisição
                }
            }

            try {
                const resposta = xhr.responseText ? JSON.parse(xhr.responseText) : {};

                if (xhr.status >= 200 && xhr.status < 300) {
                    if (onSuccess) onSuccess(resposta);
                } else {
                    console.error(`Erro na requisição (${xhr.status}): ${resposta.message || xhr.statusText}`);
                    if (onError) onError(resposta, mensagemElement);
                }
            } catch (error) {
                console.error('Erro ao processar resposta:', error);
                if (onError) {
                    onError(
                        { message: 'Erro ao processar resposta do servidor' },
                        mensagemElement
                    );
                }
            }
        }
    };

    xhr.onerror = function () {
        console.error('Erro de conexão com o servidor');
        if (onError) {
            onError(
                { message: 'Erro de conexão com o servidor' },
                mensagemElement
            );
        }
    };

    xhr.send(dados ? JSON.stringify(dados) : null);
}

// ============================================
// FUNÇÕES DE SIDEBAR E LAYOUT
// ============================================

/** Verifica se a tela está em modo mobile */
function isMobile() {
    return window.innerWidth < MOBILE_BREAKPOINT;
}

/** Abre/fecha o sidebar no mobile */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const body = document.body;

    if (!sidebar || !mobileOverlay) return;

    const isCollapsed = sidebar.classList.contains('collapsed');

    if (isMobile()) {
        if (!isCollapsed) {
            // Fechar sidebar
            sidebar.classList.add('collapsed');
            mobileOverlay.classList.remove('active');
            body.classList.remove('sidebar-open');
        } else {
            // Abrir sidebar
            sidebar.classList.remove('collapsed');
            mobileOverlay.classList.add('active');
            body.classList.add('sidebar-open');
        }
    }
}

/** Fecha o sidebar no mobile */
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const body = document.body;

    if (!sidebar || !mobileOverlay) return;

    if (isMobile()) {
        sidebar.classList.add('collapsed');
        mobileOverlay.classList.remove('active');
        body.classList.remove('sidebar-open');
    }
}

/** Inicializa os submenus do sidebar */
function inicializarSubmenus() {
    const hasSubmenuLinks = document.querySelectorAll('.has-submenu > .nav-link');

    hasSubmenuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const submenuToggle = this.querySelector('.submenu-toggle');
            const clickedOnToggle = submenuToggle && (e.target === submenuToggle || submenuToggle.contains(e.target));

            // Se for mobile OU clicou na seta
            if (isMobile() || clickedOnToggle) {
                e.preventDefault();
                e.stopPropagation();

                const parentItem = this.closest('.has-submenu');
                const isActive = parentItem.classList.contains('active');

                // Fecha outros submenus no mobile
                if (isMobile()) {
                    document.querySelectorAll('.has-submenu.active').forEach(item => {
                        if (item !== parentItem) {
                            item.classList.remove('active');
                        }
                    });
                }

                // Abre/fecha o submenu atual
                parentItem.classList.toggle('active');
            }
            // Se for um link vazio (#), não faz nada além de abrir submenu
            else if (this.getAttribute('href') === '#') {
                e.preventDefault();
                this.closest('.has-submenu').classList.toggle('active');
            }
        });
    });
}

/** Configura os eventos do sidebar */
function inicializarSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const body = document.body;

    if (!sidebar || !toggleSidebarBtn || !mobileOverlay) return;

    // Controle do toggle do sidebar
    toggleSidebarBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleSidebar();
    });

    // Overlay para fechar sidebar no mobile
    mobileOverlay.addEventListener('click', function () {
        closeSidebar();
    });

    // Fechar sidebar ao clicar fora (apenas mobile)
    document.addEventListener('click', function (e) {
        if (isMobile() &&
            !sidebar.contains(e.target) &&
            !toggleSidebarBtn.contains(e.target) &&
            !sidebar.classList.contains('collapsed')) {
            closeSidebar();
        }
    });

    // Fechar sidebar ao pressionar ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isMobile() && !sidebar.classList.contains('collapsed')) {
            closeSidebar();
        }
    });

    // Ajustar ao redimensionar
    window.addEventListener('resize', function () {
        // Se mudar para desktop e sidebar estiver aberto, fecha overlay
        if (!isMobile()) {
            mobileOverlay.classList.remove('active');
            body.classList.remove('sidebar-open');
        }

        // Garantir que sidebar comece fechado no mobile
        if (isMobile() && !sidebar.classList.contains('collapsed')) {
            sidebar.classList.add('collapsed');
        }
    });

    // Garantir que sidebar comece fechado no mobile
    if (isMobile()) {
        sidebar.classList.add('collapsed');
    }
}

// ============================================
// FUNÇÕES DE NAVEGAÇÃO E MENU
// ============================================

/** Marca o item de menu ativo com base na URL atual */
function setActiveMenuItem() {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-item a');

    // 1. Limpa todos os ativos
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.has-submenu').forEach(item => item.classList.remove('active'));

    // 2. Tenta encontrar a correspondência exata ou parcial
    for (const link of navLinks) {
        const linkHref = link.getAttribute('href') ? link.getAttribute('href').toLowerCase() : '';

        if (linkHref && currentPath.startsWith(linkHref)) {
            const navItem = link.closest('.nav-item');
            if (navItem) {
                navItem.classList.add('active');
            }

            // Se for submenu, ativa o parent também
            const hasSubmenuParent = link.closest('.has-submenu');
            if (hasSubmenuParent) {
                hasSubmenuParent.classList.add('active');
            }
        }
    }

    // 3. Se estiver na página inicial (/), marca apenas "Início"
    if (currentPath === '/' || currentPath.includes('/index')) {
        const inicioLink = document.querySelector('a[href="/"]');
        if (inicioLink) {
            const navItem = inicioLink.closest('.nav-item');
            if (navItem) {
                navItem.classList.add('active');
            }
        }
    }
}

// ============================================
// FUNÇÕES DE FORMULÁRIO E MÁSCARAS
// ============================================

/** Configura máscaras para campos de input */
function configurarMascarasDeInput() {
    // Para campos decimais
    document.querySelectorAll('.valorDecimal').forEach(function (element) {
        element.addEventListener('input', function () {
            this.value = this.value
                .replace(/[^0-9.,]/g, "") // permite apenas números, ponto e vírgula
                .replace(/([.,]).*?\1/g, "$1"); // permite somente um ponto ou vírgula
        });
    });

    // Para campos inteiros
    document.querySelectorAll('.valorInteiro').forEach(function (element) {
        element.addEventListener('input', function () {
            this.value = this.value.replace(/\D/g, ""); // somente números (0–9)
        });
    });

    // Configura máscaras para campos com data-attrs específicos
    document.querySelectorAll('[data-mask="cpf"]').forEach(el => {
        el.addEventListener('input', (e) => {
            e.target.value = aplicarMascaraCPF(e.target.value);
        });
    });

    document.querySelectorAll('[data-mask="cnpj"]').forEach(el => {
        el.addEventListener('input', (e) => {
            e.target.value = aplicarMascaraCNPJ(e.target.value);
        });
    });

    document.querySelectorAll('[data-mask="cep"]').forEach(el => {
        el.addEventListener('input', (e) => {
            e.target.value = aplicarMascaraCEP(e.target.value);
        });
    });

    document.querySelectorAll('[data-mask="telefone"]').forEach(el => {
        el.addEventListener('input', (e) => {
            e.target.value = aplicarMascaraTelefone(e.target.value);
        });
    });

    document.querySelectorAll('[data-mask="rg"]').forEach(el => {
        el.addEventListener('input', (e) => {
            e.target.value = aplicarMascaraRG(e.target.value);
        });
    });
}

// ============================================
// FUNÇÃO DE LOGOFF
// ============================================

/** Realiza o logout do usuário */
function RealizarLogoff() {
    var xmlhttp = new XMLHttpRequest();
    var theUrl = "/RealizarLogoff";

    xmlhttp.open("POST", theUrl, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                window.location.href = "/Home/Login";
            }
        }
    };

    xmlhttp.send();
}

// ============================================
// INICIALIZAÇÃO PADRÃO
// ============================================

/** Inicializa todas as funcionalidades do site */
function inicializarSite() {
    inicializarSubmenus();
    inicializarSidebar();
    setActiveMenuItem();
    configurarMascarasDeInput();
    ValidarQtdeCadastros();
}


function ValidarQtdeCadastros() {
    var qtdeCadastrosZerados = 0;
    var msgCadastro = "Para criar orçamentos, é necessário realizar os seguintes cadastros: ";

    var linkCadVendedor = document.getElementById('linkCadVendedor');
    var LinkCadOrcamento = document.getElementById('LinkCadOrcamento');
    var dashboardCardOrcamento = document.getElementById('dashboardCardOrcamento');

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/ValidarQtdeCadastros", false);

    xhr.onload = function () {
        if (xhr.status === 200) {
            var retorno = JSON.parse(xhr.responseText);

            document.getElementById('qtdeClientesCadastrados').innerHTML = retorno.qtdeClientesCadastrados;
            document.getElementById('qtdeOrcamentosEmAberto').innerHTML = retorno.qtdeOrcamentosEmAberto;
            document.getElementById('qtdeContratosFechados').innerHTML = retorno.qtdeContratosFechados;

            var qtdeAmbientesCadastrados = retorno.qtdeAmbientesCadastrados;
            var qtdeCategoriasCadastradas = retorno.qtdeCategoriasCadastradas;
            var qtdeItensCategoriasCadastradas = retorno.qtdeItensCategoriasCadastradas;
            var qtdeLojasCadastradas = retorno.qtdeLojasCadastradas;
            var qtdeVendedoresCadastrados = retorno.qtdeVendedoresCadastrados;

            if (qtdeLojasCadastradas === 0) {
                linkCadVendedor.style.display = 'none';
                msgCadastro += "Lojas";
                qtdeCadastrosZerados++;
            } else {
                linkCadVendedor.style.display = 'block';

                if (qtdeVendedoresCadastrados === 0) {
                    msgCadastro += "Vendedores";
                    qtdeCadastrosZerados++;
                }
            }

            if (qtdeAmbientesCadastrados == 0) {
                msgCadastro += "Ambientes";
                qtdeCadastrosZerados++;
            }

            if (qtdeCategoriasCadastradas == 0) {
                msgCadastro += "Categorias";
                qtdeCadastrosZerados++;
            }

            if (qtdeItensCategoriasCadastradas == 0) {
                msgCadastro += "Categorias/ Itens";
                qtdeCadastrosZerados++;
            }

            if (qtdeCadastrosZerados > 0) {
                LinkCadOrcamento.style.display = 'none';
                dashboardCardOrcamento.style.display = 'none';
            } else {
                LinkCadOrcamento.style.display = 'block';
                dashboardCardOrcamento.style.display = 'block';
            }
        }
    };

    xhr.onerror = function () {
        mostrarMensagem('Erro de conexão ao validar cadastros', 'danger');
    };

    xhr.send();

}
// Funções básicas do dashboard
document.addEventListener('DOMContentLoaded', function () {
});

// Função para navegação rápida
function navigateTo(module) {
    // Simulação de navegação
    // Implementação real redirecionaria para a página específica
}

// ============================================
// EXPORT PARA USO GLOBAL
// ============================================

// Funções principais do layout
window.inicializarSite = inicializarSite;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.isMobile = isMobile;

// Funções de modal
window.abrirModalConfirmacaoExclusao = abrirModalConfirmacaoExclusao;
window.abrirModalGenerico = abrirModalGenerico;
window.fecharModalGenerico = fecharModalGenerico;

// Funções de mensagens
window.exibirMensagemGrid = exibirMensagemGrid;
window.exibirMensagemElemento = exibirMensagemElemento;

// Funções de requisição HTTP
window.enviarRequisicaoHTTP = enviarRequisicaoHTTP;

// Funções utilitárias
window.limparCaracteresNaoNumericos = limparCaracteresNaoNumericos;
window.formatarDecimalBR = formatarDecimalBR;

// Funções de máscaras
window.aplicarMascaraCPF = aplicarMascaraCPF;
window.aplicarMascaraCNPJ = aplicarMascaraCNPJ;
window.aplicarMascaraCEP = aplicarMascaraCEP;
window.aplicarMascaraRG = aplicarMascaraRG;
window.aplicarMascaraTelefone = aplicarMascaraTelefone;

// Função de logoff
window.RealizarLogoff = RealizarLogoff;

// Inicialização automática quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSite);
} else {
    // DOM já carregado
    inicializarSite();
}

// ============================================
// BACKWARD COMPATIBILITY (para código antigo)
// ============================================

// Mantém funções antigas para compatibilidade
window.inicializarLayout = function () {
    console.warn('inicializarLayout() está obsoleta. Use inicializarSite()');
    inicializarSite();
};

window.inicializarSubmenus = inicializarSubmenus; // Mantém a função pública

window.setActiveMenuItem = setActiveMenuItem; // Mantém a função pública
