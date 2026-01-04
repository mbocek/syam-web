---
title: Ako zobraziť veľkosť adresárov v linuxe
description: Dnes sa pobavíme, ako nájsť adresár, ktorý konzumuje najviac miesta na disku.
date: '2020-05-06'
tags: ['linux', 'du', 'sort', 'head', 'technology']
---

## Ako zistiť veľkosť adresára v linuxe
Veľkosť adresára je možné zistiť prostredníctvom príkazu `du`. Prepínač `-s` spočíta celkový objem dát.
```console
$ du -s /var
du: cannot read directory '/var/spool/cron/atjobs': Permission denied
du: cannot read directory '/var/spool/cron/crontabs': Permission denied
du: cannot read directory '/var/spool/cron/atspool': Permission denied
du: cannot read directory '/var/spool/rsyslog': Permission denied
du: cannot read directory '/var/lib/apt/lists/partial': Permission denied
du: cannot read directory '/var/lib/private': Permission denied
du: cannot read directory '/var/lib/fwupd/gnupg': Permission denied
...
773244  /var
```
> je vidieť, že `du` sa nedarí spočítať veľkosť adresára kôli tomu, nemá dostatočné práva. Preto je vhodne eskalovať práva cez `sudo`.

```console
$ sudo du -s /var
775148  /var
```

Je vhodné pridať prepínač `-h`, ktorý urobí výpis čitateľný pre ľudí
```console
$ sudo du -sh /var
757M    /var
```

Prepínač `-c` vypíše sumár na konci výpisu.
```console
$ sudo du -shc /var/*
1.4M    /var/backups
77M     /var/cache
4.0K    /var/crash
467M    /var/lib
4.0K    /var/local
0       /var/lock
301M    /var/log
4.0K    /var/mail
4.0K    /var/opt
0       /var/run
56K     /var/snap
28K     /var/spool
28K     /var/tmp
846M    total
```

V prípade, že hľadáte adresár, ktorý konzumuje najviac miesta je užitočný nasledujúci príkaz:
```console
$ sudo du -h /var/ | sort -rh | head -5
854M    /var/
467M    /var/lib
346M    /var/lib/snapd
309M    /var/log
297M    /var/log/journal/1e1478446dac4cc28e7dbe7bf4b0ebcb
```
