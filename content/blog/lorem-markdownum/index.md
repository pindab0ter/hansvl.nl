---
author: Dirk Olbrich
title: Lorem markdownum Argo est praebebant Andros erat
date: 2021-01-07
description: Lorem markdownum Argo est praebebant Andros erat, tibi parte montibus erunt venis tacita spernimus more.
cover:
  src: "images/aaron-burden-AXqMy8MSSdk-unsplash.jpg"
  caption: Aaron Burden
---

## Amens nitentior vires

Lorem markdownum Argo est praebebant Andros erat, tibi parte montibus erunt
venis tacita spernimus more. Olim erat Aiax *dixi factas* potens. Perque natus
ipsa [potenti](http://fugias.com/illa.php); nunc parte precor in mortalis manant
bellica, umbrosaque et. Inrita videtur regnum, in est vulnere inductae Ilion et
feruntur Latiae famulus nec dederat uteroque lenita **fraternaque horrenda
omnia**.

1. Maris Circe victum suggerit et conscia dixit
2. Habes et undis carinae fundae lilia coniecit
3. Tot nomine ire tot fassusque nobis ad
4. Geminas iugales mille et ingenium magna agitantem
5. Nemo quae sedemque

## Iunone Theseius abstulit morabar mersis

Isto supremo, genitor Phoronidos, honos ibi lacus saepe rogato properus: sum an
vetantis. `Non Marte praecessit fistula dentibus non; in in quoque passaque. Non
tectis ferox`. Non ille et nomine vel aliisque tollens illic **morae virga**
repugnat: a lateri Achillem me illum. Acoetes `potentior` matrique occasu laborum
sua letum Inachidas irata cognoscere quae dum prohibent est exilio.

```go {linenos=table,hl_lines=["5-7"],linenostart=199}
package main

import "fmt"

// calculateSquares calculates the sum of the squares of the digits of the given number
// and sends the result to the squareop channel.
func calculateSquares(number int, squareop chan int) {
	sum := 0
	for number != 0 {
		digit := number % 10
		sum += digit * digit
		number /= 10
	}
	squareop <- sum
}

// calculateCubes calculates the sum of the cubes of the digits of the given number
// and sends the result to the cubeop channel.
func calculateCubes(number int, cubeop chan int) {
	sum := 0
	for number != 0 {
		digit := number % 10
		sum += digit * digit * digit
		number /= 10
	}
	cubeop <- sum
}

func main() {
	number := 589
	sqrch := make(chan int)
	cubech := make(chan int)

	// Start two goroutines to calculate the sum of squares and cubes of the digits.
	go calculateSquares(number, sqrch)
	go calculateCubes(number, cubech)

	// Receive the results from the channels and add them.
	squares, cubes := <-sqrch, <-cubech
	fmt.Println("Final result", squares+cubes)
}
```

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Actions\AddImagesToWorkplace;
use App\Actions\DeleteImage;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreImagesToWorkplace;
use App\Models\Image;
use App\Models\Workplace;
use Throwable;

use function __;
use function view;

class WorkplaceImageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('verified');

        $this->middleware('can:update,workplace');
        // Authorize Image?
    }

    public function index(Workplace $workplace)
    {
        return view('web.sections.admin.workplaces.images.index', compact('workplace'));
    }

    /**
     * @throws Throwable
     */
    public function store(Workplace $workplace, StoreImagesToWorkplace $request, AddImagesToWorkplace $action)
    {
        $action->execute($workplace, $request->file('images'));

        return to_route('admin.workplaces.images.index', $workplace)
            ->with('success', __('app.workplace-images-added'));
    }

    public function destroy(Workplace $workplace, Image $image, DeleteImage $action)
    {
        $action->execute($image);
        $workplace->images()->detach($image);

        return to_route('admin.workplaces.images.index', $workplace)
            ->with('success', __('app.workplace-image-deleted'));
    }
}
```

## Haec posuitque altorum

Studiosius auctoribus secuta remos partu, non animam aequalique haec tum.
**Tabellas vidit** ventus postquam ab scelus pollue canoro. Natus ede semina
illa canitiemque illac; haec illa **Hylonome** ille haut deos. Pares accepta
recipit, visaque litora, lacrimasque fovit, et Aeacus.

```
if (carrierLossyLed.digital.minisite(5, inbox_favicon_primary, javascriptRtfDns(
        5))) {
    ipx_upnp_biometrics(scsi_processor_wan, prom_hashtag_hard);
    runtime_opacity_wave.symbolic *= iphoneVideo - ajaxVpnP + wpa_plug;
}
process_hyperlink_station(horse(png_reciprocal_core.memory_p(gps, flash),
        url_restore_personal));
storage_mode.optical = 1;
```

Hiems **Athamanta nequeunt** ni nunc sanguine; imo sine solutum, virgo gurgitis
vernat vaticinatus planxere. Terris nam caeco uti multos imas saepe, Iuno dea
tremit viros Iove sub. Incaluere pectora aut sic candore habuit, foliis muta,
ait quot nemorum Fames licet, me quam! Iam imitatus modo et saxa protinus
praetereo sola Latoidos Aeacus, exitioque poenaededidit caelarat ipse et umida,
via. Lenimen Busirin, Arctos eo citaeque et artificum quidem fugit **magna**,
ubi.

---

Image: https://unsplash.com/@aaronburden