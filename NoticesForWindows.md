# Notes for developing on Windows

Windows Store apps such as GEMBA Note cannot connect to a localhost server by default. To allow connections to localhost, enable loopback adapter for each target product.

[Back to README](./README.md)

## Enabling Loopback Adapter

Run the following commands in the command prompt with administrator mode.

### eYACHO for Business 6

```batch
CheckNetIsolation.exe LoopbackExempt -a -n=MetaMoJiCorporation.eYACHOforBusiness6_dprdgbsyk6pqc
```

### eYACHO Viewer 6

```batch
CheckNetIsolation.exe LoopbackExempt -a -n=MetaMoJiCorporation.eYACHOViewer6_dprdgbsyk6pqc
```

### GEMBA Note for Business 6

```batch
CheckNetIsolation.exe LoopbackExempt -a -n=MetaMoJiCorporation.GEMBANoteforBusiness6_dprdgbsyk6pqc
```

### GEMBA Note Viewer 6

```batch
CheckNetIsolation.exe LoopbackExempt -a -n=MetaMoJiCorporation.GEMBANoteViewer6_dprdgbsyk6pqc
```

(*) It may not be necessary to run the commands above, such as when the developer mode  is turned on in your Windows settings.
