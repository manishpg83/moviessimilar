<?php

namespace App\Actions\Titles;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Image as ImageManager;
use Intervention\Image\Constraint;
use Intervention\Image\Image;
use Storage;

class StoreMediaImageOnDisk
{
    // sizes should be ordered by size (desc), to avoid blurry images
    private array $sizes = [
        'original' => null,
        'large' => 500,
        'medium' => 300,
        'small' => 92,
    ];

    public function execute(UploadedFile $file): string
    {
        $hash = Str::random(30);
        $img = ImageManager::make($file);
        $extension = $file->extension() ?? 'jpeg';

        foreach ($this->sizes as $key => $size) {
            $this->storeFile($img, $key, $hash, $extension, $size);
        }

        return "storage/media-images/backdrops/$hash/original.$extension";
    }

    private function storeFile(
        Image $img,
        string $name,
        string $hash,
        string $extension,
        ?int $size,
    ): void {
        if ($size) {
            $img->resize($size, null, function (Constraint $constraint) {
                $constraint->aspectRatio();
            });
        }

        Storage::disk('public')->put(
            "media-images/backdrops/$hash/$name.$extension",
            $img->encode($extension),
        );
    }
}
