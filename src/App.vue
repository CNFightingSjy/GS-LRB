<script setup lang="ts">
import { ref } from "vue";
import Logo from '@assets/logo-with-text.jpg';

const title = ref('');
const desc = ref('');
const generateContent = ref(`
外展影立下接参手全象划起，个空问严位高象标她，备眼合陕造矿这万位听。 又计西认效存能报联只，种文主律计整志识周进，史周X秧走据儿杏。 家必土说总地识资眼起，究状增承更马委。 保族把物民区便生将，我米积命按之院，并天否米技等红。 族们而划美易过林油，部起为记即叫大级，据有看组什交会，屈却A求战连规。 半内王农流华入取，风识形局们识工，存M皂下或更。 小般速正根下受属写验通，江已成全题最制水但，清际7又县也攻代他。 速能自系及花北作性，消识验不史想习，一计2引刷隶虚。

      话安京支地共队己场白开，增变们四励凝决先。 上采公话越长精共出，响题些类S近详。 以组着在去六法，进长便H效便。 来据海气石土物组，西处露详乱。 月口群精受与话马经，前么在些进连价思，会其9题村丧们。 两活反收况美意委外边了，何各济传维派按全很解单，的用T据当构吹且速。

      领提做高术车给江等期，个都学设决己入立，此府1U强科抄别。

      变去高是革市向习原，声由平正江断务法员，外孤决你A取肃。 象战东流传公设反件一解再，看如议回2多呀容私。 总快行要眼支向明称，眼周管拉我么相接，条区SE法手利。

      算每头争理而，她层技半形导采，即详集毛构。 群没此年低毛问离要回看能难府资关军，看传近京收例明否市私记等都再。 很指化级太四那两去式采容交，见持候照后光肃述要动厂。 上率元而说发各可济收，再专结水政己里选圆，容O县医至包装。 好以易界他特志况列教生角，利说却原当加办快生根，何集A下记励量刺茄该。 色运海老真调东，统料治据些打住，影7报财N。 加思新米型性，分飞件解引，东M量月。

      完质说备已分些风容，问除张规子家低越，他例6困也凝构。 基层因图其京说义，西细美消特自众，别Z用养E直。 样观育此选么直力圆，油向们内应战示布中，复更打也枝凝卧。 过周表干细增少，文后参实油无，你G杯装。 出还里很提京易三法铁自是，个高率战提速问根即铁我，干么D以从都常克秧还。

      用天各程都感积记又准，没始使单活结当用局今，江引4作极感光求。 眼别都务外但都确电火，照根属属存生发称长一，去等M5规来象或。

      性做龙把花每华儿动，心什在实必还组深工，能霸连指K思能。 不从周最特商按内例，心权上精消总那，易术H孟证算西。 铁流矿战治门全理论，类收战书少取什时，生华4科林还道。 万及声造总育交细别身，律方采电自几省解状运，就始L人离询第要。

      或发完易加说件，议称变常更名，说8直更板。 件强院也质质人格位，却后今准西值百全些，府J抓否处与管。

      农证加转向识知向象，步格思织去龙快，基何肃松Y回应。 它便下技单条出和清放工权当，其目安土例参除林备名除，风又且N询成术究记详体。 主阶现一今非立京，后酸油向电气称属，利专极她又法义。 思次基容听角京，能南P建。
`);
</script>

<template>
    <div class="root"
    >
        <div class="root_left p-4">
            <div class="gs-caption">标题</div>
            <input placeholder="请输入标题" class="gs-input mb-4" :value="title"/>
            <div class="gs-caption">文案简介</div>
            <textarea placeholder="请输入文案简介" class="gs-input mb-4 gs-textarea" :value="desc"/>
            <button class="my-2 gs-button gs-button-primary">一键生成</button>
        </div>
        <div class="root_right">
            <div class="logo_head px-4 pt-4">
                <img :src="Logo"/>
            </div>
            <section class="generated_content p-8">
                {{ generateContent }}
            </section>
            <div class="action_bar">
                <div class="action">
                    <span class="gs-icon-wrapper">📄</span>
                    一键复制
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/styles/tool" as tools;

.root {
    height: 100vh;
    overflow: hidden;
    width: 100vw;
    display: flex;

    &_left {
        flex: 0 0 38.2%;
        @include tools.flexColumn;
        justify-content: flex-start;
        @apply bg-slate-100 border-r-2 select-none;
    }

    &_right {
        flex: 0 0 61.8%;
        @include tools.flexColumn;
        @apply text-slate-700;
        position: relative;

        .logo_head {
            @apply flex justify-end select-none
            border-b;
            img {
                height: 60px;
                width: auto;
                object-fit: cover;
            }
        }
    }

}

.generated_content {
    @apply pb-32;
    font-family: serif;
    font-size: 20px;
    overflow-y: auto;
    line-height: 30px;
}
@mixin boxShadowTopOnly {
    box-shadow: 0 -5px 40px -20px rgba(0, 0, 0, 0.5);
}
.action_bar {
    @apply border-t-2 bg-white
    hover:bg-slate-100
    transition-colors
    select-none;
    @include boxShadowTopOnly;
    cursor: pointer;
    height: 60px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    .action {
        font-weight: bold;
        width: 100%;
        height: 100%;
        @apply flex items-center justify-center text-slate-800 text-lg;
    }
}
</style>
