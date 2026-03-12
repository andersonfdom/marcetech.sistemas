document.addEventListener('DOMContentLoaded', function () {
    window.tipoPessoaAtual = '0';
    validarTipoPessoa('0');

    const logoUpload = document.getElementById('logoUpload');
    const previewContainer = document.getElementById('previewContainer');
    const logoExistente = document.getElementById('logoExistente');
    const Logo = document.getElementById('Logo');
    const removeImage = document.getElementById('removeImage');

    // Upload de Imagem
    logoUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];

        if (file) {
            if (file.size > 2097152) {
                alert("O arquivo é muito grande! O máximo permitido é 2MB.");
                this.value = "";
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {

                const base64String = event.target.result;
                previewContainer.classList.remove('d-none');
                logoExistente.src = base64String;

                Logo.value = base64String;
            };

            reader.readAsDataURL(file);
        }
    });

    // Remover Imagem
    removeImage.addEventListener('click', function () {
        logoUpload.value = "";
        Logo.value = "";
        logoExistente.src = "#";
        previewContainer.classList.add('d-none');
    });
});

// Máscaras
const inputTelefone = document.getElementById('Telefone');
inputTelefone.addEventListener('input', (e) => {
    e.target.value = formatarTelefone(e.target.value);
});

const inputCep = document.getElementById('Cep');
inputCep.addEventListener('input', (e) => {
    e.target.value = formatarCEP(e.target.value);
    const cepLimpo = e.target.value.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
        validarCep(e.target.value);
    }
});

const inputCpfcnpj = document.getElementById('Cpfcnpj');
inputCpfcnpj.addEventListener('input', (e) => {
    if (window.tipoPessoaAtual === '0') {
        e.target.value = formatarCPF(e.target.value);
    } else {
        e.target.value = formatarCNPJ(e.target.value);
    }
});

// Funções de Formatação e Validação
function validarTipoPessoa(valor) {
    window.tipoPessoaAtual = valor;
    const inputCpfcnpj = document.getElementById('Cpfcnpj');
    const dadosRg = document.getElementById('dadosRg');

    inputCpfcnpj.value = "";
    inputCpfcnpj.maxLength = (valor === '0') ? 14 : 18;

    if (valor === '0') {
        document.getElementById('lblNome').innerHTML = "Nome Completo";
        document.getElementById('lblCpfcnpj').innerHTML = "CPF";
        dadosRg.style.display = 'block';
        inputCpfcnpj.placeholder = "000.000.000-00";
    } else {
        document.getElementById('lblNome').innerHTML = "Razão Social";
        document.getElementById('lblCpfcnpj').innerHTML = "CNPJ";
        dadosRg.style.display = 'none';
        inputCpfcnpj.placeholder = "00.000.000/0000-00";
    }
}

function formatarCPF(valor) {
    valor = valor.replace(/\D/g, '').substring(0, 11);
    return valor
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatarCNPJ(valor) {
    valor = valor.replace(/\D/g, '').substring(0, 14);
    return valor
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
}

function formatarTelefone(valor) {
    let tel = valor.replace(/\D/g, '').substring(0, 11);
    return tel
        .replace(/^(\d{2})(\d)/, '($1)$2')
        .replace(/(\d{1})(\d{4})(\d)/, '$1 $2-$3')
        .substring(0, 15);
}

function formatarCEP(cep) {
    return cep.replace(/\D/g, '')
        .substring(0, 8)
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2-$3');
}

function validarCep(valor) {
    const cep = valor.replace(/\D/g, '');
    const campos = {
        Logradouro: document.getElementById('Logradouro'),
        Bairro: document.getElementById('Bairro'),
        Cidade: document.getElementById('Cidade'),
        Estado: document.getElementById('Estado')
    };

    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json())
            .then(data => {
                if (!data.erro) {
                    const estadosExtenso = {
                        'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas', 'BA': 'Bahia',
                        'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo', 'GO': 'Goiás',
                        'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul', 'MG': 'Minas Gerais',
                        'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná', 'PE': 'Pernambuco', 'PI': 'Piauí',
                        'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte', 'RS': 'Rio Grande do Sul',
                        'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina', 'SP': 'São Paulo',
                        'SE': 'Sergipe', 'TO': 'Tocantins'
                    };

                    campos.Logradouro.value = data.logradouro;
                    campos.Bairro.value = data.bairro;
                    campos.Cidade.value = data.localidade;
                    campos.Estado.value = estadosExtenso[data.uf] || data.uf;

                    Object.values(campos).forEach(c => c.disabled = true);
                    document.getElementById('Numerologradouro').focus();
                } else {
                    Object.values(campos).forEach(c => c.disabled = false);
                    campos.Logradouro.focus();
                }
            })
            .catch(err => console.error("Erro ao buscar o CEP:", err));
    }
}

// Submissão do Formulário
document.getElementById('btnCadastrar').addEventListener('click', function () {
    const form = document.getElementById('formPreCadastro');
    const camposDesabilitados = form.querySelectorAll(':disabled');

    camposDesabilitados.forEach(c => c.disabled = false);

    const formData = new FormData(form);
    const objetoDados = {};

    formData.forEach((value, key) => {
        objetoDados[key] = value;
    });

    // Ajustes para o DTO
    if (objetoDados.Logo) {
        objetoDados.Logo = objetoDados.Logo.split(',')[1];
    }
    objetoDados.Tipopessoa = parseInt(objetoDados.Tipopessoa);

    camposDesabilitados.forEach(c => c.disabled = true);

    fetch('/Cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(objetoDados)
    })
        .then(res => {
            if (!res.ok) throw new Error('Erro na comunicação com o servidor.');
            return res.json();
        })
        .then(data => {
            if (data.codigo === 0) {
                Swal.fire({
                    title: data.mensagem,
                    icon: "success",
                    draggable: true
                }).then(() => {
                    window.location.href = '/Home/Login';
                });
            } else {
                switch (data.codigo) {
                    case 2:
                        document.getElementById('Nome').focus();
                        break;
                    case 3:
                        document.getElementById('Cpfcnpj').focus();
                        break;
                    case 4:
                        document.getElementById('Telefone').focus();
                        break;
                    case 5:
                        document.getElementById('Email').focus();
                        break;
                    case 6:
                        document.getElementById('Cep').focus();
                        break;
                    case 7:
                        document.getElementById('Logradouro').focus();
                        break;
                    case 8:
                        document.getElementById('Numerologradouro').focus();
                        break;
                    case 9:
                        document.getElementById('Bairro').focus();
                        break;
                    case 10:
                        document.getElementById('Cidade').focus();
                        break;
                    case 11:
                        document.getElementById('Estado').focus();
                        break;
                    case 12:
                        document.getElementById('Senha').focus();
                        break;
                    default:
                        document.getElementById('ConfirmarSenha').focus();
                }
                Swal.fire({
                    title: data.mensagem,
                    icon: "error",
                    draggable: true
                });
            }
        })
        .catch(err => {
            console.error('Erro detalhado:', err);
            alert("Ocorreu um erro inesperado ao processar o cadastro.");
        });
});
