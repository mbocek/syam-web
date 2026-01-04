---
title: Ako zobraziť obsah adresára v linuxe
description: Ukážeme si, ako zobraziť obsah adresára v linuxe a prípadne rôzne varianty príkazu pre zobrazenie obsahu adresára.
date: '2020-05-01'
tags: ['linux', 'ls', 'technology']
---

## Ako zistiť obsah adresára v linuxe
V linuxe slúži pre zobrazenie obsahu adresára príkaz `ls`
```bash
$ ls
eipp.log.xz  history.log  term.log
```

Pre zobrazenie detailov o súboroch a adresároch
```console
$ ls -l
total 56
-rw-r--r-- 1 root root 21472 May  1 17:16 eipp.log.xz
-rw-r--r-- 1 root root 21914 May  1 17:18 history.log
-rw-r----- 1 root adm   6676 May  1 17:18 term.log
```

Väčšina linuxových distribúcii obsahuje alias `ll` na príkaz `ls -la`, ktorý vylistuje obsah adresára v rozšírenom formáte vrátane skrytých súborov
```console
$ ll
total 64
drwxr-xr-x 2 root root    4096 May  1 17:16 ./
drwxrwxr-x 9 root syslog  4096 May  1 17:31 ../
-rw-r--r-- 1 root root   21472 May  1 17:16 eipp.log.xz
-rw-r--r-- 1 root root   21914 May  1 17:18 history.log
-rw-r----- 1 root adm     6676 May  1 17:18 term.log
```

## Zobraziť obsah adresára trochu inak
Súčasťou dlhého výpisu adresára je aj veľkosť súboru avšak defaultne je uvedená v bitoch. Ak chceme aby bola zobrazená čitateľne pre ľudí je potrebné použiť prepínač `-h`
```console
$ ls -lh
total 56K
-rw-r--r-- 1 root root  21K May  1 17:16 eipp.log.xz
-rw-r--r-- 1 root root  22K May  1 17:18 history.log
-rw-r----- 1 root adm  6.6K May  1 17:18 term.log
```

Občas sa môže hodiť vylistovať súbory a adresáre podľa poslednej zmeny prepínač `-t` a v obrátenom poradí `-r`
```console
$ ls -ltr
total 56
-rw-r--r-- 1 root root 21472 May  1 17:16 eipp.log.xz
-rw-r----- 1 root adm   6676 May  1 17:18 term.log
-rw-r--r-- 1 root root 21914 May  1 17:18 history.log
```

Rovnako je učitočné vylistovať súbory podľa veľkosti
```console
$ ls -lS
total 56
-rw-r--r-- 1 root root 21914 May  1 17:18 history.log
-rw-r--r-- 1 root root 21472 May  1 17:16 eipp.log.xz
-rw-r----- 1 root adm   6676 May  1 17:18 term.log
```

A nedávno sa mi veľmi hodilo vylistovať zoznam súborov, ktorý neobsahuje súbory so zadanou príponou
```console
$ ls -l !(*.xz)
-rw-r--r-- 1 root root 21914 May  1 17:18 history.log
-rw-r----- 1 root adm   6676 May  1 17:18 term.log
```
> v tomto prípade sa nevylistuje archív xz