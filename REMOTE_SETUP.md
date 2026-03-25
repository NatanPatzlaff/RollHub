# 🏠 Configuração Remota — Acessar o RollHub de Casa

## Pré-requisitos

O notebook do **trabalho** já está configurado com:
- ✅ Tailscale instalado (IP: `100.76.141.110`)
- ✅ SSH Server rodando (StartType: Automatic)

---

## Passos no Notebook de CASA

### 1. Instalar o Tailscale

1. Acesse: https://tailscale.com/download/windows
2. Instale e faça login com a **mesma conta** usada no notebook do trabalho
3. Após logar, os dois notebooks vão se enxergar pela rede Tailscale

### 2. Testar a conexão SSH

Abra o PowerShell e rode:

```powershell
ssh User@100.76.141.110
```

- Digite a senha do Windows do notebook do trabalho
- Se conectar, digite `exit` para sair

### 3. Configurar o VS Code Remote

1. Abra o **VS Code**
2. Instale a extensão **"Remote - SSH"** (da Microsoft)
3. Pressione `Ctrl+Shift+P` → digite **Remote-SSH: Connect to Host**
4. Digite: `User@100.76.141.110`
5. Digite a senha do Windows quando pedir
6. Clique **"Open Folder"** → navegue até `C:\Users\User\Documents\RollHub`
7. Pronto! Edite os arquivos normalmente 🎉

---

## Antes de sair do trabalho (checklist)

- [ ] `npm run dev` rodando no terminal (ou `npm run build` + `node bin/server.js`)
- [ ] Notebook configurado para **NÃO suspender** ao fechar a tampa
- [ ] Tailscale conectado (ícone na bandeja do sistema)
- [ ] Fechar a tampa e ir embora

---

## Comandos úteis

### Verificar se o SSH está rodando (notebook do trabalho)

```powershell
Get-Service sshd | Format-List Name, Status, StartType
```

### Ver o IP Tailscale

```powershell
tailscale ip -4
```

Ou acesse: https://login.tailscale.com/admin/machines

---

## Troubleshooting

### Não consigo conectar via SSH
1. Verifique se o Tailscale está conectado nos **dois** notebooks
2. Verifique se o SSH está rodando: `Get-Service sshd`
3. Se o SSH parou, reinicie: `Start-Service sshd` (como Admin)

### O site não está acessível
1. Verifique se o `npm run dev` ainda está rodando no notebook do trabalho
2. Acesse remotamente e reinicie se necessário

### Esqueci a senha do Windows
- A senha é a mesma do login do Windows no notebook do trabalho
