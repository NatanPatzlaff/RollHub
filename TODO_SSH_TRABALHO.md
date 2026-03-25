# 🔧 TODO — Configurar SSH no PC do Trabalho

> **Quando:** Amanhã ao chegar no trabalho
> **Por quê:** Para poder acessar o PC do trabalho de casa via SSH + VS Code Remote

---

## Passo 1 — Criar senha para o usuário (necessário pro SSH)

Abra o **PowerShell como Administrador** e rode:

```powershell
net user User 1234
```

> Troque `1234` por uma senha da sua preferência. Você vai usar essa senha pra conectar de casa.

---

## Passo 2 — Adicionar chave SSH do notebook de casa (opcional, pra não digitar senha toda vez)

### 2.1 Crie a pasta `.ssh` se não existir:

```powershell
mkdir C:\Users\User\.ssh -Force
```

### 2.2 Adicione a chave pública:

```powershell
Add-Content -Path "C:\Users\User\.ssh\authorized_keys" -Value "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEjY3DO0aDK/sAwpWwWg/BU79S+UlOeFiZV6RROC46uG natan@rollhub"
```

### 2.3 Ajuste as permissões (importante!):

```powershell
icacls "C:\Users\User\.ssh\authorized_keys" /inheritance:r /grant "User:(R)" /grant "SYSTEM:(R)"
```

> ⚠️ Se o usuário `User` for Administrador, a chave precisa estar em outro arquivo:
> ```powershell
> Add-Content -Path "C:\ProgramData\ssh\administrators_authorized_keys" -Value "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEjY3DO0aDK/sAwpWwWg/BU79S+UlOeFiZV6RROC46uG natan@rollhub"
> icacls "C:\ProgramData\ssh\administrators_authorized_keys" /inheritance:r /grant "SYSTEM:(R)" /grant "Administradores:(R)"
> ```

---

## Passo 3 — Verificar se o SSH Server está rodando

```powershell
Get-Service sshd | Format-List Name, Status, StartType
```

Se estiver `Stopped`, inicie:

```powershell
Start-Service sshd
Set-Service -Name sshd -StartupType 'Automatic'
```

---

## Passo 4 — Testar localmente

```powershell
ssh User@localhost
```

Se conectar, está tudo certo! ✅

---

## Passo 5 — De casa, conectar

```powershell
ssh User@100.76.141.110
```

Ou pelo VS Code: `Ctrl+Shift+P` → **Remote-SSH: Connect to Host** → `User@100.76.141.110`

---

## ✅ Checklist Rápido

- [ ] `net user User SENHA` — criar senha
- [ ] Adicionar chave pública ao `authorized_keys`
- [ ] `Get-Service sshd` — verificar se SSH tá rodando
- [ ] `ssh User@localhost` — testar localmente
- [ ] Apagar este arquivo depois de configurar (`git rm TODO_SSH_TRABALHO.md`)
