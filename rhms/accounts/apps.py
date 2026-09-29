from django.apps import AppConfig


class AccountsConfig(AppConfig):
    name = 'accounts'

    def ready(self):
        import os
        from django.conf import settings
        
        logo_path = os.path.join(settings.BASE_DIR, 'frontend', 'public', 'logo.jpeg')
        if os.path.exists(logo_path):
            try:
                from PIL import Image, ImageChops
                im = Image.open(logo_path)
                # Convert to RGB if needed
                if im.mode != 'RGB':
                    im = im.convert('RGB')
                bg = Image.new('RGB', im.size, (255, 255, 255))
                diff = ImageChops.difference(im, bg)
                diff = ImageChops.add(diff, diff, 2.0, -100)
                bbox = diff.getbbox()
                if bbox:
                    # Crop with small padding of 5px
                    padding = 5
                    left = max(0, bbox[0] - padding)
                    top = max(0, bbox[1] - padding)
                    right = min(im.size[0], bbox[2] + padding)
                    bottom = min(im.size[1], bbox[3] + padding)
                    
                    cropped = im.crop((left, top, right, bottom))
                    cropped.save(logo_path)
            except Exception:
                pass
