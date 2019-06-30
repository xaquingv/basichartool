import nlp from 'compromise'
import sentence from './nlg/sentences'

export default function (data) {

    let paras = [];

    data.forEach(d => {
        const p = concat(d);
        const pc = clean(p);
        const para = {
            data: { key: d.data.id, value: d.data.value },
            paragraph: pc
        }
        paras.push(para);
    })

    return paras;
}

function concat(data) {

    let sentences = []
    sentences.push(sentence(data.data, 'sentence'));
    data.explanation.forEach(d => sentences.push(d.a));

    return sentences.join(' ');
}

function clean(text) {

    let _text = nlp(text).normalize({ numbers: false, punctuation: false, case: false })

    // let numbers = _text.values().noUnits()
    // let n = numbers.values().greaterThan(20);
    // let b = n.values().toNice();


    // let proper = _text.topics()
    // let a = proper.toTitleCase();

    let _textout = _text.out('text').replace(' $', '$')

    return _textout;
}