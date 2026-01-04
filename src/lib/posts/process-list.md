---
title: Ako zobraziť zoznam bežiacich procesov v linuxe
description: V tomto blogposte by som chcel prejsť možnosti, ako sa v linuxe dá zobraziť zoznam bežiacich procesov.
date: '2020-07-24'
tags: ['linux','ps','top','technology']
---

## Ako zobraziť zoznam bežiacich procesov v linuxe
Každý linuxový/unixový systém má dostupnú systémovú utilitu pre vylistovanie zoznamu procesov `ps`.
```console
$ ps
    PID TTY          TIME CMD
   1106 pts/0    00:00:00 bash
   1122 pts/0    00:00:00 ps
```
> príkaz zobrazí aktuálne bežiace procesy aktuálne prihláseného užívateľa.

Príkaz `ps` podporuje štandardnú syntax a aj BSD syntax. Ja sa tu zameriam na štandardnú syntax.

Pre vylistovanie všetkých procesov bežiacich v celom operačnom systéme slúži prepínač `-e` a aby sme dostali plný výpis je vhodné použiť prepínač `-f`
```console
$ ps -ef
UID          PID    PPID  C STIME TTY          TIME CMD
root           1       0  0 20:12 ?        00:00:02 /sbin/init maybe-ubiquity
root           2       0  0 20:12 ?        00:00:00 [kthreadd]
root           3       2  0 20:12 ?        00:00:00 [rcu_gp]
...
```

## Ako zobraziť zoznam threadov daného procesu
Veľmi užitočný je prepínač na vylistovanie threadov daného procesu. Prepínač `-H` slúži na zobrazenie threadov. `-u` user oriented výpis. `-p` slúži na vyber procesu.
```console
$ ps -Hu -p 447
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
mbocek     447  0.0  7.5 26689476 1969888 pts/2 Sl+ 22:49   0:00 /home/mbocek/.sdkman/candidates/java/current/bin/jav
mbocek     447 23.8  7.5 26689476 1969888 pts/2 Sl+ 22:49   0:07 /home/mbocek/.sdkman/candidates/java/current/bin/jav
mbocek     447  0.5  7.5 26689476 1969888 pts/2 Sl+ 22:49   0:00 /home/mbocek/.sdkman/candidates/java/current/bin/jav
...
```

Adekvátny vypis threadov je možné získať aj pomocov programu `top`. Prepínač `-H` slúži na výpis thredov a prepínač `-p` slúži na výber procesu.
```console
$ top -H -p 447
top - 23:13:29 up  3:10,  0 users,  load average: 0.40, 0.36, 0.29
Threads:  41 total,   0 running,  41 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.1 us,  1.0 sy,  0.0 ni, 98.8 id,  0.0 wa,  0.0 hi,  0.2 si,  0.0 st
MiB Mem :  25446.7 total,  22090.4 free,   2637.5 used,    718.8 buff/cache
MiB Swap:   7168.0 total,   7168.0 free,      0.0 used.  22497.8 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
  500 mbocek    20   0   25.5g   2.0g  24040 S   6.0   8.1   1:09.49 Thread-5
  483 mbocek    20   0   25.5g   2.0g  24040 S   0.3   8.1   0:00.31 GC Thread#8
  447 mbocek    20   0   25.5g   2.0g  24040 S   0.0   8.1   0:00.00 java
  ...
```
