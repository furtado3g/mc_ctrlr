import { POST_FORMATS, POST_THEMES, type PostGeneratorConfig } from '@/types/birthdays';

/**
 * Loads an image from URL or dataURL with CORS support.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(new Error(`Falha ao carregar imagem: ${src}`));
        img.src = src;
    });
}

/**
 * Draws the motoclube emblem SVG path onto the canvas context.
 */
function drawEmblem(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
    ctx.save();
    ctx.translate(x - size / 2, y - size / 2);
    const scale = size / 42;
    ctx.scale(scale, scale);
    ctx.fillStyle = color;

    // SVG path equivalent to AppLogoIcon
    const p = new Path2D(
        'M17.2 5.63325L8.6 0.855469L0 5.63325V32.1434L16.2 41.1434L32.4 32.1434V23.699L40 19.4767V9.85547L31.4 5.07769L22.8 9.85547V18.2999L17.2 21.411V5.63325ZM38 18.2999L32.4 21.411V15.2545L38 12.1434V18.2999ZM36.9409 10.4439L31.4 13.5221L25.8591 10.4439L31.4 7.36561L36.9409 10.4439ZM24.8 18.2999V12.1434L30.4 15.2545V21.411L24.8 18.2999ZM23.8 20.0323L29.3409 23.1105L16.2 30.411L10.6591 27.3328L23.8 20.0323ZM7.6 27.9212L15.2 32.1434V38.2999L2 30.9666V7.92116L7.6 11.0323V27.9212ZM8.6 9.29991L3.05913 6.22165L8.6 3.14339L14.1409 6.22165L8.6 9.29991ZM30.4 24.8101L17.2 32.1434V38.2999L30.4 30.9666V24.8101ZM9.6 11.0323L15.2 7.92117V22.5221L9.6 25.6333V11.0323Z'
    );
    ctx.fill(p);
    ctx.restore();
}

/**
 * Main function that renders the birthday card onto a Canvas element.
 */
export async function renderBirthdayPost(
    canvas: HTMLCanvasElement,
    config: PostGeneratorConfig
): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dimensions = POST_FORMATS[config.format] || POST_FORMATS.feed_square;
    const { width, height } = dimensions;

    // Set canvas native resolution
    canvas.width = width;
    canvas.height = height;

    const theme = POST_THEMES[config.theme] || POST_THEMES.dark_gold;

    // 1. Draw Background
    drawBackground(ctx, width, height, theme);

    // 2. Draw Decorative Borders / Frames
    drawBorders(ctx, width, height, theme, config.format);

    // 3. Layout Dimensions Calculation
    const isStories = config.format === 'stories';
    const isPortrait = config.format === 'feed_portrait';

    let avatarCenterY: number;
    let avatarRadius: number;

    if (isStories) {
        avatarCenterY = height * 0.42;
        avatarRadius = width * 0.28;
    } else if (isPortrait) {
        avatarCenterY = height * 0.40;
        avatarRadius = width * 0.26;
    } else {
        // Square 1:1
        avatarCenterY = height * 0.43;
        avatarRadius = width * 0.24;
    }

    const avatarCenterX = width / 2;

    // 4. Header Badge & Club Logo
    drawHeader(ctx, width, avatarCenterY, avatarRadius, theme, isStories);

    // 5. Draw Avatar Image or Fallback Initials
    await drawAvatar(ctx, avatarCenterX, avatarCenterY, avatarRadius, config, theme);

    // 6. Draw Member Name, Road Nickname, Regional and Congratulations Message
    drawTypography(ctx, width, height, avatarCenterY, avatarRadius, config, theme, isStories);
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, theme: typeof POST_THEMES.dark_gold) {
    ctx.save();

    // Base background gradient
    const bgGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        width * 0.1,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
    );

    if (theme.id === 'asphalt_speed') {
        bgGrad.addColorStop(0, '#26292B');
        bgGrad.addColorStop(1, '#111213');
    } else if (theme.id === 'classic_vintage') {
        bgGrad.addColorStop(0, '#1E293B');
        bgGrad.addColorStop(1, '#0B0F19');
    } else {
        // dark_gold
        bgGrad.addColorStop(0, '#1C1A17');
        bgGrad.addColorStop(1, '#0A0A0A');
    }

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Subtle noise/textured lines for road aesthetic
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Glow effect behind avatar
    const glowGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.4,
        50,
        width / 2,
        height * 0.4,
        width * 0.45
    );
    glowGrad.addColorStop(0, `${theme.accentColor}25`);
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
}

function drawBorders(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    theme: typeof POST_THEMES.dark_gold,
    format: string
) {
    ctx.save();
    const margin = 40;

    // Outer decorative border
    ctx.strokeStyle = `${theme.accentColor}55`;
    ctx.lineWidth = 2;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    // Corner accents
    const cornerSize = 40;
    ctx.strokeStyle = theme.accentColor;
    ctx.lineWidth = 4;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(margin, margin + cornerSize);
    ctx.lineTo(margin, margin);
    ctx.lineTo(margin + cornerSize, margin);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(width - margin - cornerSize, margin);
    ctx.lineTo(width - margin, margin);
    ctx.lineTo(width - margin, margin + cornerSize);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(margin, height - margin - cornerSize);
    ctx.lineTo(margin, height - margin);
    ctx.lineTo(margin + cornerSize, height - margin);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(width - margin - cornerSize, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.lineTo(width - margin, height - margin - cornerSize);
    ctx.stroke();

    ctx.restore();
}

function drawHeader(
    ctx: CanvasRenderingContext2D,
    width: number,
    avatarCenterY: number,
    avatarRadius: number,
    theme: typeof POST_THEMES.dark_gold,
    isStories: boolean
) {
    ctx.save();
    const logoY = isStories ? 130 : 100;
    const logoSize = 64;

    // Draw club emblem
    drawEmblem(ctx, width / 2, logoY, logoSize, theme.accentColor);

    // Club Header Title
    ctx.fillStyle = theme.accentColor;
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '6px';
    ctx.fillText('MOTOCLUBE OFICIAL', width / 2, logoY + 54);

    // Top Headline Tag
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 48px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '4px';

    const headlineY = avatarCenterY - avatarRadius - 40;
    ctx.fillText('FELIZ ANIVERSÁRIO', width / 2, headlineY);

    // Subtle horizontal divider line with diamond
    ctx.strokeStyle = `${theme.accentColor}80`;
    ctx.lineWidth = 1.5;
    const lineHalfWidth = 140;
    ctx.beginPath();
    ctx.moveTo(width / 2 - lineHalfWidth, headlineY + 16);
    ctx.lineTo(width / 2 - 15, headlineY + 16);
    ctx.moveTo(width / 2 + 15, headlineY + 16);
    ctx.lineTo(width / 2 + lineHalfWidth, headlineY + 16);
    ctx.stroke();

    // Diamond center
    ctx.fillStyle = theme.accentColor;
    ctx.beginPath();
    ctx.arc(width / 2, headlineY + 16, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

async function drawAvatar(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    config: PostGeneratorConfig,
    theme: typeof POST_THEMES.dark_gold
) {
    ctx.save();

    // Outer ring shadow
    ctx.shadowColor = `${theme.accentColor}66`;
    ctx.shadowBlur = 30;

    // Double frame ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 14, 0, Math.PI * 2);
    ctx.strokeStyle = `${theme.accentColor}40`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 6, 0, Math.PI * 2);
    ctx.strokeStyle = theme.accentColor;
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.shadowBlur = 0; // reset shadow

    // Clip to circle for avatar image
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    let imageLoaded = false;
    if (config.photoUrl) {
        try {
            const img = await loadImage(config.photoUrl);

            // Compute scaling and centering with zoom & pan
            const zoom = Math.max(0.5, Math.min(3.0, config.zoom || 1.0));
            const aspect = img.width / img.height;
            let drawW: number;
            let drawH: number;

            if (aspect > 1) {
                drawH = radius * 2 * zoom;
                drawW = drawH * aspect;
            } else {
                drawW = radius * 2 * zoom;
                drawH = drawW / aspect;
            }

            const drawX = centerX - drawW / 2 + (config.panX || 0);
            const drawY = centerY - drawH / 2 + (config.panY || 0);

            ctx.drawImage(img, drawX, drawY, drawW, drawH);
            imageLoaded = true;
        } catch (e) {
            console.warn('Erro ao carregar imagem para o canvas, usando fallback', e);
        }
    }

    if (!imageLoaded) {
        // Fallback: draw stylish initials and gradient
        const grad = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
        grad.addColorStop(0, '#2D3748');
        grad.addColorStop(1, '#1A202C');
        ctx.fillStyle = grad;
        ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

        // Initials
        const initials = config.member.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0].toUpperCase())
            .join('');

        ctx.fillStyle = theme.accentColor;
        ctx.font = `bold ${Math.round(radius * 0.7)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, centerX, centerY);
    }

    ctx.restore();
}

function drawTypography(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    avatarCenterY: number,
    avatarRadius: number,
    config: PostGeneratorConfig,
    theme: typeof POST_THEMES.dark_gold,
    isStories: boolean
) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    const startY = avatarCenterY + avatarRadius + 60;

    // Member Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 46px system-ui, -apple-system, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(config.member.name.toUpperCase(), width / 2, startY);

    let nextY = startY + 44;

    // Road Nickname
    if (config.showNickname && config.member.road_nickname) {
        ctx.fillStyle = theme.accentColor;
        ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
        ctx.fillText(`"${config.member.road_nickname.toUpperCase()}"`, width / 2, nextY);
        nextY += 40;
    }

    // Regional & Date Badge
    if (config.showRegional && config.member.regional_name) {
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '600 22px system-ui, -apple-system, sans-serif';
        ctx.letterSpacing = '2px';
        const regionalInfo = `REGIONAL ${config.member.regional_name.toUpperCase()} • ${config.member.birth_day_month.toUpperCase()}`;
        ctx.fillText(regionalInfo, width / 2, nextY);
        nextY += 38;
    }

    // Subtitle Message / Congratulations Wish
    const messageY = isStories ? height - 220 : height - 120;
    ctx.fillStyle = '#E5E7EB';
    ctx.font = 'italic 500 24px Georgia, serif';
    ctx.fillText(config.subheadline || 'Muitos quilômetros de vida, saúde e irmandade na estrada!', width / 2, messageY);

    // Bottom Decorative Club Signature
    const footerY = height - 55;
    ctx.fillStyle = `${theme.accentColor}99`;
    ctx.font = '600 16px system-ui, sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('LEALDADE • HONRA • RESPEITO', width / 2, footerY);

    ctx.restore();
}
