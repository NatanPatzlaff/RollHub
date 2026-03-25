# 🏠 Configuração Remota — Acessar o RollHub de Casa

## Status do Notebook do Trabalho

- ✅ Tailscale instalado e conectado
- ✅ Conta: `NatanPatzlaff@github`
- ✅ Device: `desktop-nv50vkh`
- ✅ IP Tailscale: `100.76.141.110`
- ✅ SSH Server rodando (StartType: Automatic)
- ✅ Tampa configurada para não suspender ao fechar
- ✅ Site rodando (`npm run dev`)

---

## Passos no Notebook de CASA

### 1. Instalar o Tailscale

1. Acesse: https://tailscale.com/download/windows
2. Instale e faça login com a conta **NatanPatzlaff@github** (mesma do trabalho)
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

## Checklist — Antes de sair do trabalho

- [ ] `npm run dev` rodando no terminal
- [ ] Notebook conectado na **tomada** (senão a bateria acaba)
- [ ] Tailscale conectado (ícone na bandeja do sistema)
- [ ] Fechar a tampa e ir embora

---

## Comandos Úteis

```powershell
# Verificar se o SSH está rodando (no notebook do trabalho)
Get-Service sshd | Format-List Name, Status, StartType

# Ver o IP Tailscale
# Ou acesse: https://login.tailscale.com/admin/machines
```

---

## Troubleshooting

| Problema | Solução |
|---|---|
| Não conecta via SSH | Verifique se o Tailscale está conectado nos **dois** notebooks |
| SSH parou | Rode `Start-Service sshd` como Admin no notebook do trabalho |
| Site caiu | Acesse remotamente e reinicie o `npm run dev` |
| Esqueci a senha | É a senha do login do Windows do notebook do trabalho |
