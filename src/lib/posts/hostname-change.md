---
title: Zmena hostnamu v linuxe
description: V tomto blogposte si ukážeme, ako jednoducho zmeniť hostname v linuxovom systéme prostredníctvom štandardne dostupných príkazov.
date: '2020-04-19'
tags: ['linux','hostname','hostnamectl','technology']
---

## Ako zistiť hostname v linuxe
Zmeniť hostname v linuxe je pomerne jednoduché. Na začiatku by sme si ho však mali najprv zobraziť.
```console
$ hostname
demo
```
> v mojom prípade je hostname demo

V prípade, že chcem viac detailov o danom počítači môžem použiť príkaz
```console
$ hostnamectl
   Static hostname: demo
         Icon name: computer-vm
           Chassis: vm
        Machine ID: 1e1478446dac4cc28e7dbe7bf4b0ebcb
           Boot ID: 970e654af40b4d138b6fff9787734e00
    Virtualization: vmware
  Operating System: Ubuntu 20.04 LTS
            Kernel: Linux 5.4.0-26-generic
      Architecture: x86-64
```

## Zmena hostname v linuxe
A teraz poďme zmeniť hostname. Budeme menit hostname na *new-demo*
```console
$ sudo hostnamectl set-hostname new-demo
```
>je potrebné eskalovať práva cez sudo, prípadne prihlásiť sa ako root

## Kontrola hostname v linuxe
Následne by sa malo stačiť odhlásiť a prihlásiť. Nová session by mala už obsahovať zmenený hostname. Prípadne môžme reštartovať daný počítač.
Len pre kontrolu:
```console
$ hostnamectl
   Static hostname: new-demo
         Icon name: computer-vm
           Chassis: vm
        Machine ID: 1e1478446dac4cc28e7dbe7bf4b0ebcb
           Boot ID: 970e654af40b4d138b6fff9787734e00
    Virtualization: vmware
  Operating System: Ubuntu 20.04 LTS
            Kernel: Linux 5.4.0-26-generic
      Architecture: x86-64
```
